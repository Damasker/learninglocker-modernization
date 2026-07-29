import assert from 'assert';
import { ORGANISATION, ORGANISATION_ID, RESTIFY_PREFIX } from 'lib/constants/routes';
import {
  buildOrganisationReadFilter,
  isNativeOrganisationRouterEnabled,
  ORGANISATION_MODEL_NAME,
} from './organisation';

describe('native Organisation router contracts', () => {
  it('defaults feature flag to off', () => {
    assert.strictEqual(isNativeOrganisationRouterEnabled({}), false);
    assert.strictEqual(
      isNativeOrganisationRouterEnabled({ ENABLE_NATIVE_ORGANISATION_ROUTER: 'false' }),
      false
    );
    assert.strictEqual(
      isNativeOrganisationRouterEnabled({ ENABLE_NATIVE_ORGANISATION_ROUTER: 'true' }),
      true
    );
  });

  it('freezes Organisation model name and /v2 paths', () => {
    assert.strictEqual(ORGANISATION_MODEL_NAME, 'organisation');
    assert.strictEqual(ORGANISATION, `${RESTIFY_PREFIX}/organisation`);
    assert.strictEqual(ORGANISATION_ID, `${RESTIFY_PREFIX}/organisation/:id`);
  });

  it('AND-combines scope and request filters', () => {
    assert.deepStrictEqual(
      buildOrganisationReadFilter({
        scopeFilter: { _id: { $in: ['org-1'] } },
        requestFilter: { name: 'Acme' },
      }),
      {
        $and: [
          { _id: { $in: ['org-1'] } },
          { name: 'Acme' },
        ],
      }
    );
  });

  it('omits empty request filter from $and', () => {
    assert.deepStrictEqual(
      buildOrganisationReadFilter({
        scopeFilter: { _id: { $in: ['org-1'] } },
        requestFilter: {},
      }),
      { $and: [{ _id: { $in: ['org-1'] } }] }
    );
  });
});
