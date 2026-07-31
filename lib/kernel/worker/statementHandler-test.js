import assert from 'assert';
import {
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
} from 'lib/constants/statements';
import {
  parseAllowedWorkerQueues,
  ALLOWABLE_WORKER_QUEUES,
} from './allowedWorkerQueues';
import { selectPendingQueueNames } from './selectPendingQueues';
import { STATEMENT_POST_INGEST_QUEUES } from './pipeline';

describe('allowedWorkerQueues parsing', () => {
  it('defaults to all allowable queues when env is undefined', () => {
    assert.deepStrictEqual(
      parseAllowedWorkerQueues(undefined),
      ALLOWABLE_WORKER_QUEUES
    );
  });

  it('disables all optional queues when env is empty string', () => {
    assert.deepStrictEqual(parseAllowedWorkerQueues(''), []);
  });

  it('filters unknown queue names', () => {
    assert.deepStrictEqual(
      parseAllowedWorkerQueues(`${STATEMENT_EXTRACT_PERSONAS_QUEUE},NOT_A_QUEUE`),
      [STATEMENT_EXTRACT_PERSONAS_QUEUE]
    );
  });
});

describe('selectPendingQueueNames', () => {
  const allowAll = () => true;

  it('enqueues all post-ingest queues for a fresh statement', () => {
    const pending = selectPendingQueueNames(
      { completedQueues: [], processingQueues: [] },
      STATEMENT_POST_INGEST_QUEUES,
      allowAll
    );
    assert.deepStrictEqual(pending.sort(), [
      STATEMENT_EXTRACT_PERSONAS_QUEUE,
      STATEMENT_FORWARDING_QUEUE,
      STATEMENT_QUERYBUILDERCACHE_QUEUE,
    ].sort());
  });

  it('skips completed and processing queues', () => {
    const pending = selectPendingQueueNames(
      {
        completedQueues: [STATEMENT_EXTRACT_PERSONAS_QUEUE],
        processingQueues: [STATEMENT_QUERYBUILDERCACHE_QUEUE],
      },
      STATEMENT_POST_INGEST_QUEUES,
      allowAll
    );
    assert.deepStrictEqual(pending, [STATEMENT_FORWARDING_QUEUE]);
  });

  it('respects isAllowed gate', () => {
    const pending = selectPendingQueueNames(
      { completedQueues: [], processingQueues: [] },
      STATEMENT_POST_INGEST_QUEUES,
      queueName => queueName === STATEMENT_FORWARDING_QUEUE
    );
    assert.deepStrictEqual(pending, [STATEMENT_FORWARDING_QUEUE]);
  });
});
