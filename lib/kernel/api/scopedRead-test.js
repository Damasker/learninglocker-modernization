import assert from 'assert';
import { buildScopedReadFilter, isEnvFlagEnabled } from './scopedRead';

describe('scopedRead helpers', () => {
  it('defaults env flags to off', () => {
    assert.strictEqual(isEnvFlagEnabled('ENABLE_NATIVE_DASHBOARD_ROUTER', {}), false);
    assert.strictEqual(
      isEnvFlagEnabled('ENABLE_NATIVE_DASHBOARD_ROUTER', { ENABLE_NATIVE_DASHBOARD_ROUTER: 'true' }),
      true
    );
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildScopedReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: { isPublic: true },
      }),
      {
        $and: [
          { organisation: 'org-1' },
          { isPublic: true },
        ],
      }
    );
  });

  it('omits empty request filter', () => {
    assert.deepStrictEqual(
      buildScopedReadFilter({
        scopeFilter: { organisation: 'org-1' },
        requestFilter: {},
      }),
      { $and: [{ organisation: 'org-1' }] }
    );
  });
});
