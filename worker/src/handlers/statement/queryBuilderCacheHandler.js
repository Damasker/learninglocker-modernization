// @ll-compat-audit: ok 2026-08-01
import wrapHandlerForStatement from 'worker/handlers/statement/wrapHandlerForStatement';
import { STATEMENT_QUERYBUILDERCACHE_QUEUE } from 'lib/constants/statements';
import { queryBuilderCacheStatementHandler } from 'lib/kernel/worker/queryBuilderCache';

export { queryBuilderCacheStatementHandler } from 'lib/kernel/worker/queryBuilderCache';

export default wrapHandlerForStatement(
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  queryBuilderCacheStatementHandler
);
