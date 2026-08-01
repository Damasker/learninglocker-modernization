// @ll-compat-audit: ok 2026-08-01
import wrapHandlerForStatement from 'worker/handlers/statement/wrapHandlerForStatement';
import { STATEMENT_FORWARDING_QUEUE } from 'lib/constants/statements';
import { statementForwardingStatementHandler } from 'lib/kernel/worker/statementForwarding';

export {
  forwardStatementToRequestQueues,
  statementForwardingStatementHandler,
} from 'lib/kernel/worker/statementForwarding';

export default wrapHandlerForStatement(
  STATEMENT_FORWARDING_QUEUE,
  statementForwardingStatementHandler
);
