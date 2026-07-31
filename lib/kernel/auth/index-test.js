import assert from 'assert';
import {
  ALL,
  SITE_ADMIN,
  SITE_CAN_CREATE_ORG,
  OBSERVER,
  XAPI_ALL,
  XAPI_READ,
  XAPI_STATEMENTS_READ,
  XAPI_STATEMENTS_WRITE,
  XAPI_STATEMENTS_READ_MINE,
  XAPI_STATE_ALL,
  XAPI_PROFILE_ALL,
  XAPI_STATEMENTS_DELETE,
} from './scopes';
import {
  getOrgFromAuthInfo,
  getTokenTypeFromAuthInfo,
  getScopesFromAuthInfo,
  getUserIdFromAuthInfo,
  getScopeFilter,
  getScopeSelect,
} from './index';

describe('auth scope contracts', () => {
  it('freezes durable scope string values', () => {
    assert.strictEqual(ALL, 'all');
    assert.strictEqual(SITE_ADMIN, 'site_admin');
    assert.strictEqual(SITE_CAN_CREATE_ORG, 'site_can_create_org');
    assert.strictEqual(OBSERVER, 'observer');
    assert.strictEqual(XAPI_ALL, 'xapi/all');
    assert.strictEqual(XAPI_READ, 'xapi/read');
    assert.strictEqual(XAPI_STATEMENTS_READ, 'statements/read');
    assert.strictEqual(XAPI_STATEMENTS_WRITE, 'statements/write');
    assert.strictEqual(XAPI_STATEMENTS_READ_MINE, 'statements/read/mine');
    assert.strictEqual(XAPI_STATE_ALL, 'state');
    assert.strictEqual(XAPI_PROFILE_ALL, 'profile');
    assert.strictEqual(XAPI_STATEMENTS_DELETE, 'statements/delete');
  });
});

describe('auth kernel exports', () => {
  it('re-exports selector and filter functions', () => {
    assert.equal(typeof getOrgFromAuthInfo, 'function');
    assert.equal(typeof getTokenTypeFromAuthInfo, 'function');
    assert.equal(typeof getScopesFromAuthInfo, 'function');
    assert.equal(typeof getUserIdFromAuthInfo, 'function');
    assert.equal(typeof getScopeFilter, 'function');
    assert.equal(typeof getScopeSelect, 'function');
  });

  it('resolves organisation from organisation token authInfo', () => {
    const orgId = '561a679c0c5d017e4004715a';
    assert.strictEqual(
      getOrgFromAuthInfo({ token: { tokenType: 'organisation', tokenId: orgId } }),
      orgId
    );
  });

  it('resolves organisation from client authInfo', () => {
    const orgId = '561a679c0c5d017e4004715b';
    assert.strictEqual(
      getOrgFromAuthInfo({ client: { organisation: orgId } }),
      orgId
    );
  });
});
