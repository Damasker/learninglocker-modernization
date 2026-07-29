/**
 * Shared wrapper: load statement by id, run handler, publish completion
 * status back onto STATEMENT_QUEUE (state machine driver).
 */
import logger from 'lib/logger';
import Statement from 'lib/models/statement';
import * as Queue from 'lib/services/queue';
import { STATEMENT_QUEUE } from 'lib/constants/statements';

export default (queueName, statementHandler) => ({ statementId }, jobDone, options) => {
  logger.debug('START', queueName, statementId);
  return Statement.findById(statementId, (err, statement) => {
    if (err) {
      logger.error(`Error loading statement ${statementId} for ${queueName}`, err);
      return jobDone(err);
    }
    if (!statement) {
      logger.info(`Purged job for ${queueName} as statement ${statementId} does not exist`);
      return jobDone();
    }
    statementHandler(statement, (handlerErr) => {
      logger.debug('COMPLETED STATEMENT HANDLER FOR', queueName, statementId);
      if (handlerErr) {
        logger.error(`Error in ${queueName} for statement ${statementId}`, handlerErr);
        return jobDone(handlerErr);
      }
      const payload = { status: queueName, statementId };
      try {
        return Queue.publish({
          queueName: STATEMENT_QUEUE,
          payload
        }, jobDone);
      } catch (publishErr) {
        logger.error(`Error publishing status back to ${STATEMENT_QUEUE}`, payload, publishErr);
        return jobDone(publishErr);
      }
    }, options);
  });
};
