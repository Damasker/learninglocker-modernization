// @ll-compat-audit: ok 2026-08-01
import wrapHandlerForStatement from 'worker/handlers/statement/wrapHandlerForStatement';
import { STATEMENT_EXTRACT_PERSONAS_QUEUE } from 'lib/constants/statements';
import {
  extractPersonasStatementHandler,
} from 'lib/kernel/worker/extractPersonas';

export {
  extractPersonasStatementHandler,
} from 'lib/kernel/worker/extractPersonas';

// PROCESS START
export default personaService => wrapHandlerForStatement(
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  extractPersonasStatementHandler(personaService)
);
