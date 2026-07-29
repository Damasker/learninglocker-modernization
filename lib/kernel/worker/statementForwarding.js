import { map } from 'lodash';
import mongoose from 'mongoose';
import StatementForwarding from 'lib/models/statementForwarding';
import * as Queue from 'lib/services/queue';
import logger from 'lib/logger';
import mongoFilteringInMemory from 'lib/helpers/mongoFilteringInMemory';
import parseQuery from 'lib/helpers/parseQuery';
import { STATEMENT_FORWARDING_REQUEST_QUEUE } from 'lib/constants/statements';

const objectId = mongoose.Types.ObjectId;

/**
 * Match active statementForwarding configs and enqueue HTTP request jobs.
 * Worker wrapHandler owns STATEMENT_FORWARDING_QUEUE completion publishing.
 */
export const forwardStatementToRequestQueues = (statement, {
  queue = Queue
} = {}) =>
  StatementForwarding.find({
    organisation: objectId(statement.organisation),
    active: true,
    _id: {
      $nin: statement.completedForwardingQueue
    }
  }).then((statementForwardings) => {
    const promises = map(statementForwardings, async (statementForwarding) => {
      const queueName = STATEMENT_FORWARDING_REQUEST_QUEUE;

      const query = statementForwarding.query && JSON.parse(statementForwarding.query);
      const authInfo = {
        token: {
          tokenType: 'worker',
          tokenId: statement.organisation
        }
      };
      const parsedQuery = await parseQuery(query, { authInfo });

      return new Promise((resolve, reject) => {
        const theParsedQuery = parsedQuery && (parsedQuery.$match || parsedQuery);
        if (theParsedQuery && !mongoFilteringInMemory(theParsedQuery)(statement)) {
          return resolve();
        }

        queue.publish({
          queueName,
          payload: {
            status: queueName,
            statement,
            statementForwarding
          }
        }, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });

    return Promise.all(promises);
  }).then(() => {
    logger.debug('SUCCESS adding forwarding statement to forwarding statement request queue');
  }).catch((err) => {
    logger.error('FAILED adding forwarding statement to forwarding statement request queue');
    throw err;
  });

export const statementForwardingStatementHandler = (statement, done, options) =>
  forwardStatementToRequestQueues(statement, options)
    .then(() => done())
    .catch(err => done(err));
