import {
  keys,
  reject,
  includes,
  intersection,
} from 'lodash';

/**
 * Pure selection of which post-ingest queues still need work for a statement.
 */
export const selectPendingQueueNames = (
  statement,
  queues,
  isAllowed
) => {
  const queueNames = keys(queues);
  return reject(queueNames, (queueName) => {
    const queue = queues[queueName];
    const completedQueues = statement.completedQueues || [];
    const processingQueues = statement.processingQueues || [];
    const intersectionQueues = intersection(queue.preReqs, completedQueues);
    const preReqsCompleted = intersectionQueues.length === queue.preReqs.length;
    const queueCompleted = includes(completedQueues, queueName);
    const queueProcessing = includes(processingQueues, queueName);
    const isAllowedQueue = isAllowed(queueName);

    return !preReqsCompleted || queueCompleted || queueProcessing || !isAllowedQueue;
  });
};
