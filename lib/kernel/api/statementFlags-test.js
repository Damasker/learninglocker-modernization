import assert from 'assert';
import {
  STATEMENT_REST,
  STATEMENT_REST_ID,
  RESTIFY_PREFIX,
} from 'lib/constants/routes';
import { isNativeStatementRouterEnabled } from './statementFlags';

describe('native Statement GET router contracts', () => {
  it('defaults Statement flag to off', () => {
    assert.strictEqual(isNativeStatementRouterEnabled({}), false);
  });

  it('enables Statement flag', () => {
    assert.strictEqual(
      isNativeStatementRouterEnabled({ ENABLE_NATIVE_STATEMENT_ROUTER: 'true' }),
      true
    );
  });

  it('freezes /v2 statement paths', () => {
    assert.strictEqual(STATEMENT_REST, `${RESTIFY_PREFIX}/statement`);
    assert.strictEqual(STATEMENT_REST_ID, `${RESTIFY_PREFIX}/statement/:id`);
  });
});
