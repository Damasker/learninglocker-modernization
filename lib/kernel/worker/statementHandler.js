import Statement from 'lib/models/statement';
import highland from 'highland';
import logger from 'lib/logger';
import { size } from 'lodash';

import * as Queue from 'lib/services/queue';
import { STATEMENT_POST_INGEST_QUEUES } from 'lib/kernel/worker/pipeline';
import { isAllowedWorkerQueue as defaultIsAllowedWorkerQueue } from 'lib/kernel/worker/allowedWorkerQueues';
import { selectPendingQueueNames } from 'lib/kernel/worker/selectPendingQueues';

export { selectPendingQueueNames } from 'lib/kernel/worker/selectPendingQueues';

const queueDependencies = STATEMENT_POST_INGEST_QUEUES;

export const addStatementToPendingQueues = (statement, passedQueues, done) => {
  const queues = passedQueues || queueDependencies;
  if (!statement) {
    logger.error('No statement provided');
    return done();
  }

  const pendingQueueNames = selectPendingQueueNames(
    statement,
    queues,
    defaultIsAllowedWorkerQueue
  );

  return Statement.updateOne(
    { _id: statement._id },
    {
      $addToSet: { processingQueues: { $each: pendingQueueNames } }
    },
    (err) => {
      if (err) return done(err);
      return highland(pendingQueueNames).flatMap((queueName) => {
        logger.debug('ADDING STATEMENT TO QUEUE', queueName);
        const response = Queue.publish({
          queueName,
          payload: { statementId: statement._id }
        });
        return highland(response);
      }).apply(() => {
        if (size(pendingQueueNames) > 0) {
          logger.debug(`ADDED ${statement._id} to ${pendingQueueNames.join(', ')}`);
        } else {
          logger.debug(`PROCESSED QUEUE FOR STATEMENT ${statement._id}`);
        }

        return done();
      });
    }
  );
};

export default ({ status, statementId }, jobDone) => {
  try {
    if (status) {
      logger.debug(`COMPLETED ${statementId} - ${status}`);
      const idFilter = { _id: statementId };
      return Statement.updateOne(
        idFilter,
        {
          $addToSet: { completedQueues: status },
          $pull: { processingQueues: status }
        },
        async (err) => {
          const statement = await Statement.findOne(idFilter)
            .select({ _id: 1, completedQueues: 1, processingQueues: 1 })
            .lean();

          if (err) logger.error('Statement update error', err);
          if (err) return jobDone(err);
          return addStatementToPendingQueues(statement, queueDependencies, (queueErr) => {
            if (queueErr) logger.error('addStatementToPendingQueues error', queueErr);
            if (jobDone) return jobDone(queueErr);
          });
        }
      );
    }

    logger.debug(`NO STATUS, statementId: ${statementId}`);
    return Statement.findById(
      statementId,
      { _id: 1, completedQueues: 1, processingQueues: 1 },
      (err, statement) => {
        if (err) {
          logger.error('statementHandler findById error', err);
          if (jobDone) return jobDone(err);
          return undefined;
        }
        addStatementToPendingQueues(statement, queueDependencies, (queueErr) => {
          if (queueErr) logger.error('addStatementToPendingQueues error', queueErr);
          if (jobDone) return jobDone(queueErr);
        });
      }
    );
  } catch (err) {
    logger.error('statementHandler error', err);
    if (jobDone) jobDone(err);
  }
};
