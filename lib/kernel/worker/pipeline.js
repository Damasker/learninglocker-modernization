/**
 * Post-ingest fan-out: which queues statementHandler may enqueue.
 * preReqs stay empty for now; keep this map the single source for strangler refactors.
 */
import {
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
} from 'lib/constants/statements';

export const STATEMENT_POST_INGEST_QUEUES = {
  [STATEMENT_QUERYBUILDERCACHE_QUEUE]: {
    preReqs: [],
  },
  [STATEMENT_EXTRACT_PERSONAS_QUEUE]: {
    preReqs: [],
  },
  [STATEMENT_FORWARDING_QUEUE]: {
    preReqs: [],
  },
};
