import assert from 'assert';
import { USER, USER_ID, RESTIFY_PREFIX } from 'lib/constants/routes';
import {
  buildUserReadFilter,
  isNativeUserRouterEnabled,
  USER_MODEL_NAME,
} from './user';

describe('native User router contracts', () => {
  it('defaults feature flag to off', () => {
    assert.strictEqual(isNativeUserRouterEnabled({}), false);
    assert.strictEqual(isNativeUserRouterEnabled({ ENABLE_NATIVE_USER_ROUTER: 'true' }), true);
  });

  it('freezes User model name and /v2 paths', () => {
    assert.strictEqual(USER_MODEL_NAME, 'user');
    assert.strictEqual(USER, `${RESTIFY_PREFIX}/user`);
    assert.strictEqual(USER_ID, `${RESTIFY_PREFIX}/user/:id`);
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildUserReadFilter({
        scopeFilter: { organisations: 'org-1' },
        requestFilter: { email: 'a@b.c' },
      }),
      {
        $and: [
          { organisations: 'org-1' },
          { email: 'a@b.c' },
        ],
      }
    );
  });
});
