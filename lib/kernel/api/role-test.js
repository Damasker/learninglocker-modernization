import assert from 'assert';
import { ROLE, ROLE_ID, RESTIFY_PREFIX } from 'lib/constants/routes';
import {
  buildRoleReadFilter,
  isNativeRoleRouterEnabled,
  ROLE_MODEL_NAME,
} from './role';

describe('native Role router contracts', () => {
  it('defaults feature flag to off', () => {
    assert.strictEqual(isNativeRoleRouterEnabled({}), false);
    assert.strictEqual(isNativeRoleRouterEnabled({ ENABLE_NATIVE_ROLE_ROUTER: 'true' }), true);
  });

  it('freezes Role model name and /v2 paths', () => {
    assert.strictEqual(ROLE_MODEL_NAME, 'role');
    assert.strictEqual(ROLE, `${RESTIFY_PREFIX}/role`);
    assert.strictEqual(ROLE_ID, `${RESTIFY_PREFIX}/role/:id`);
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildRoleReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: { title: 'Admin' },
      }),
      {
        $and: [
          { organisation: 'org-1' },
          { title: 'Admin' },
        ],
      }
    );
  });
});
