import assert from 'assert';
import {
  STATEMENT_FORWARDING,
  STATEMENT_FORWARDING_ID,
  QUERY_BUILDER_CACHE,
  QUERY_BUILDER_CACHE_ID,
  QUERY_BUILDER_CACHE_VALUE,
  QUERY_BUILDER_CACHE_VALUE_ID,
  RESTIFY_PREFIX,
} from 'lib/constants/routes';
import {
  isNativeStatementForwardingRouterEnabled,
  isNativeQueryBuilderCacheRouterEnabled,
  isNativeQueryBuilderCacheValueRouterEnabled,
} from './forwardingCacheFlags';

describe('native forwarding/cache GET router contracts', () => {
  it('defaults all forwarding/cache flags to off', () => {
    assert.strictEqual(isNativeStatementForwardingRouterEnabled({}), false);
    assert.strictEqual(isNativeQueryBuilderCacheRouterEnabled({}), false);
    assert.strictEqual(isNativeQueryBuilderCacheValueRouterEnabled({}), false);
  });

  it('enables each flag independently', () => {
    assert.strictEqual(
      isNativeStatementForwardingRouterEnabled({
        ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER: 'true',
      }),
      true
    );
    assert.strictEqual(
      isNativeQueryBuilderCacheRouterEnabled({
        ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER: 'true',
      }),
      true
    );
    assert.strictEqual(
      isNativeQueryBuilderCacheValueRouterEnabled({
        ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER: 'true',
      }),
      true
    );
  });

  it('freezes /v2 forwarding and cache paths', () => {
    assert.strictEqual(STATEMENT_FORWARDING, `${RESTIFY_PREFIX}/statementforwarding`);
    assert.strictEqual(
      STATEMENT_FORWARDING_ID,
      `${RESTIFY_PREFIX}/statementforwarding/:id`
    );
    assert.strictEqual(QUERY_BUILDER_CACHE, `${RESTIFY_PREFIX}/querybuildercache`);
    assert.strictEqual(
      QUERY_BUILDER_CACHE_ID,
      `${RESTIFY_PREFIX}/querybuildercache/:id`
    );
    assert.strictEqual(
      QUERY_BUILDER_CACHE_VALUE,
      `${RESTIFY_PREFIX}/querybuildercachevalue`
    );
    assert.strictEqual(
      QUERY_BUILDER_CACHE_VALUE_ID,
      `${RESTIFY_PREFIX}/querybuildercachevalue/:id`
    );
  });
});
