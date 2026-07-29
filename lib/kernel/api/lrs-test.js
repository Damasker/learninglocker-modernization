import assert from 'assert';
import { LRS, LRS_ID, RESTIFY_PREFIX } from 'lib/constants/routes';
import {
  buildLrsReadFilter,
  isNativeLrsRouterEnabled,
  LRS_MODEL_NAME,
} from './lrs';

describe('native LRS router contracts', () => {
  it('defaults feature flag to off', () => {
    assert.strictEqual(isNativeLrsRouterEnabled({}), false);
    assert.strictEqual(isNativeLrsRouterEnabled({ ENABLE_NATIVE_LRS_ROUTER: 'false' }), false);
    assert.strictEqual(isNativeLrsRouterEnabled({ ENABLE_NATIVE_LRS_ROUTER: 'true' }), true);
  });

  it('freezes LRS model name and /v2 paths', () => {
    assert.strictEqual(LRS_MODEL_NAME, 'lrs');
    assert.strictEqual(LRS, `${RESTIFY_PREFIX}/lrs`);
    assert.strictEqual(LRS_ID, `${RESTIFY_PREFIX}/lrs/:id`);
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildLrsReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: { title: 'Store A' },
      }),
      {
        $and: [
          { organisation: 'org-1' },
          { title: 'Store A' },
        ],
      }
    );
  });

  it('omits empty request filter from $and', () => {
    assert.deepStrictEqual(
      buildLrsReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: {},
      }),
      { $and: [{ organisation: 'org-1' }] }
    );
  });
});
