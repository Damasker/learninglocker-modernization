import assert from 'assert';
import {
  SITE_SETTINGS,
  SITE_SETTINGS_ID,
  STREAM,
  STREAM_ID,
  BATCH_DELETE,
  BATCH_DELETE_ID,
  RESTIFY_PREFIX,
} from 'lib/constants/routes';
import {
  isNativeSiteSettingsRouterEnabled,
  isNativeStreamRouterEnabled,
  isNativeBatchDeleteRouterEnabled,
} from './restrictedFlags';

describe('native restricted GET router contracts', () => {
  it('defaults all restricted flags to off', () => {
    assert.strictEqual(isNativeSiteSettingsRouterEnabled({}), false);
    assert.strictEqual(isNativeStreamRouterEnabled({}), false);
    assert.strictEqual(isNativeBatchDeleteRouterEnabled({}), false);
  });

  it('freezes /v2 restricted paths', () => {
    assert.strictEqual(SITE_SETTINGS, `${RESTIFY_PREFIX}/sitesettings`);
    assert.strictEqual(SITE_SETTINGS_ID, `${RESTIFY_PREFIX}/sitesettings/:id`);
    assert.strictEqual(STREAM, `${RESTIFY_PREFIX}/stream`);
    assert.strictEqual(STREAM_ID, `${RESTIFY_PREFIX}/stream/:id`);
    assert.strictEqual(BATCH_DELETE, `${RESTIFY_PREFIX}/batchdelete`);
    assert.strictEqual(BATCH_DELETE_ID, `${RESTIFY_PREFIX}/batchdelete/:id`);
  });
});
