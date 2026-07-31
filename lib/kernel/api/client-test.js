import assert from 'assert';
import { CLIENT, CLIENT_ID, RESTIFY_PREFIX } from 'lib/constants/routes';
import {
  buildClientReadFilter,
  isNativeClientRouterEnabled,
  CLIENT_MODEL_NAME,
} from './client';

describe('native Client router contracts', () => {
  it('defaults feature flag to off', () => {
    assert.strictEqual(isNativeClientRouterEnabled({}), false);
    assert.strictEqual(isNativeClientRouterEnabled({ ENABLE_NATIVE_CLIENT_ROUTER: 'false' }), false);
    assert.strictEqual(isNativeClientRouterEnabled({ ENABLE_NATIVE_CLIENT_ROUTER: 'true' }), true);
  });

  it('freezes Client model name and /v2 paths', () => {
    assert.strictEqual(CLIENT_MODEL_NAME, 'client');
    assert.strictEqual(CLIENT, `${RESTIFY_PREFIX}/client`);
    assert.strictEqual(CLIENT_ID, `${RESTIFY_PREFIX}/client/:id`);
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildClientReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: { isTrusted: true },
      }),
      {
        $and: [
          { organisation: 'org-1' },
          { isTrusted: true },
        ],
      }
    );
  });

  it('omits empty request filter from $and', () => {
    assert.deepStrictEqual(
      buildClientReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: {},
      }),
      { $and: [{ organisation: 'org-1' }] }
    );
  });
});
