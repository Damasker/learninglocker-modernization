import logger from 'lib/logger';
import {
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
} from 'lib/constants/statements';

/**
 * Allowable post-ingest worker queues gated by ALLOWED_WORKER_QUEUES.
 * @type {string[]}
 */
export const ALLOWABLE_WORKER_QUEUES = [
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
];

/**
 * @param {string | undefined} allowedWorkerQueuesString
 * @param {string[]} [allowableWorkerQueues]
 * @return {string[]}
 */
export const parseAllowedWorkerQueues = (
  allowedWorkerQueuesString,
  allowableWorkerQueues = ALLOWABLE_WORKER_QUEUES
) => {
  if (allowedWorkerQueuesString === undefined) {
    return allowableWorkerQueues;
  }

  if (allowedWorkerQueuesString === '') {
    return [];
  }

  return allowedWorkerQueuesString.split(',').reduce(
    (acc, queueString) => {
      if (allowableWorkerQueues.includes(queueString)) {
        return acc.concat([queueString]);
      }
      logger.warn(`"${queueString}" is ignored as an allowed worker queue. Allowable worker queues are ${allowableWorkerQueues.map(q => `"${q}"`).join(', ')}`);
      return acc;
    },
    [],
  );
};

const allowedWorkerQueues = parseAllowedWorkerQueues(process.env.ALLOWED_WORKER_QUEUES);

/* eslint-disable import/prefer-default-export */
export const isAllowedWorkerQueue = queueName => allowedWorkerQueues.includes(queueName);
