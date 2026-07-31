import { post } from 'axios';
import { assign, isPlainObject } from 'lodash';
import { PassThrough } from 'stream';
import highland from 'highland';
import getAttachments, {
  streamStatementsWithAttachments,
  boundary,
} from 'lib/kernel/xapiStatements/attachments';
import logger from 'lib/logger';
import Statement, { mapDot } from 'lib/models/statement';
import mongoose from 'mongoose';
import StatementForwarding from 'lib/models/statementForwarding';
import ForwardingRequestError from 'lib/kernel/worker/ForwardingRequestError';
import {
  STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE,
} from 'lib/constants/statements';
import * as Queue from 'lib/services/queue';
import defaultGetStatementsRepo from 'lib/kernel/worker/statementsRepo';

const objectId = mongoose.Types.ObjectId;

const generateHeaders = (statementForwarding, statement) => {
  const statementForwardingModel = new StatementForwarding(statementForwarding);
  const authHeaders = statementForwardingModel.getAuthHeaders();
  const nonAuthHeaders = statementForwardingModel.getHeaders(statement);
  const allHeaders = authHeaders.merge(nonAuthHeaders);
  return allHeaders.toJS();
};

const createBodyWithAttachments = async (
  statementModel,
  statementToSend,
  getStatementsRepo
) => {
  const repo = getStatementsRepo();
  const attachments = await getAttachments({ repo }, [statementModel], true, statementModel.lrs_id);
  const stream = highland();
  await streamStatementsWithAttachments(statementToSend, attachments, stream);
  const passthrough = new PassThrough();
  stream.pipe(passthrough);
  return passthrough;
};

export const sendForwardingRequest = async (
  statementToSend,
  statementForwarding,
  fullStatement,
  { getStatementsRepo = defaultGetStatementsRepo, httpPost = post } = {}
) => {
  const forwardingProtocol = statementForwarding.configuration.protocol;
  const forwardingUrl = statementForwarding.configuration.url;
  const url = `${forwardingProtocol}://${forwardingUrl}`;
  const statement = mapDot(statementToSend);
  const validateStatus = statusCode => statusCode >= 200 && statusCode < 400;
  const timeout = 5000;

  try {
    if (statementForwarding.sendAttachments) {
      const stream = await createBodyWithAttachments(
        fullStatement,
        statement,
        getStatementsRepo
      );
      const headers = {
        ...generateHeaders(statementForwarding, fullStatement),
        'Content-Type': `multipart/mixed; charset=UTF-8; boundary=${boundary}`,
      };
      await httpPost(url, stream, { headers, timeout, validateStatus });
    } else {
      const headers = {
        ...generateHeaders(statementForwarding, fullStatement),
        'Content-Type': 'application/json',
      };
      await httpPost(url, statement, { headers, timeout, validateStatus });
    }
  } catch (err) {
    const message = err.response ? 'Status code was invalid' : err.message;
    const responseBody = err.response ? err.response.body : null;
    const responseStatus = err.response ? err.response.status : null;
    const headers = err.request ? err.request.headers : null;
    throw new ForwardingRequestError(message, { headers, responseBody, responseStatus, url });
  }
};

const setPendingStatements = (statement, statementForwardingId) =>
  Statement.updateOne({ _id: statement._id }, {
    $addToSet: {
      pendingForwardingQueue: statementForwardingId
    }
  });

const setCompleteStatements = (statement, statementForwardingId) =>
  Statement.updateOne({ _id: statement._id }, {
    $addToSet: {
      completedForwardingQueue: statementForwardingId
    },
    $pull: {
      pendingForwardingQueue: statementForwardingId
    }
  });

/**
 * HTTP forward attempt with retry/dead-letter handoff via delayed queue.
 */
export const statementForwardingRequestHandler = async (
  { statement, statementForwarding },
  done,
  {
    queue = Queue,
    getStatementsRepo = defaultGetStatementsRepo,
    httpPost = post,
  } = {}
) => {
  try {
    await setPendingStatements(
      statement,
      statementForwarding._id
    );

    await sendForwardingRequest(
      statementForwarding.fullDocument ? statement : statement.statement,
      statementForwarding,
      statement,
      { getStatementsRepo, httpPost }
    );

    await setCompleteStatements(statement, statementForwarding._id);

    logger.debug(
      `SUCCESS sending statement ${statement._id} to ${statementForwarding.configuration.url}`
    );

    done();
  } catch (err) {
    logger.info(
      `FAILED sending statement ${statement._id} to ${statementForwarding.configuration.url}`,
      err
    );

    let update = {
      timestamp: new Date(),
      statementForwarding_id: objectId(statementForwarding._id),
      message: err.toString()
    };

    if (err.messageBody) {
      if (isPlainObject(err.messageBody)) {
        update = assign({}, update, { errorInfo: err.messageBody });
      }
    }

    try {
      await Statement.updateOne(
        { _id: statement._id },
        {
          $addToSet: {
            failedForwardingLog: update
          }
        }
      );

      const updatedStatement = await Statement.findOne({ _id: statement._id });

      if (
        updatedStatement.failedForwardingLog.length <=
        statementForwarding.configuration.maxRetries
      ) {
        logger.info(`SENDING statement ${updatedStatement._id} to ${STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE}`);
        queue.publish({
          queueName: STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE,
          payload: {
            status: STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE,
            statement: updatedStatement,
            statementForwarding
          }
        }, (publishErr) => {
          if (publishErr) {
            logger.error(`FAILED sending statement ${updatedStatement._id} to ${STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE}`, publishErr);
            done(publishErr);
            throw new Error('Error publishing to queue');
          }
          done();
        });
      } else {
        logger.info(`EXCEEDED max retry for statement ${updatedStatement._id}, failing (should go to dead letter queue).`);
        done(err); // failed, let redrive send to dead letter queue
      }
    } catch (updateErr) {
      logger.error('Failed updating failedForwardingLog', updateErr);
    }
  }

  return [statement._id];
};

export default statementForwardingRequestHandler;
