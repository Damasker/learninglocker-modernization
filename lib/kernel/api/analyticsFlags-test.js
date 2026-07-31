import assert from 'assert';
import {
  DASHBOARD,
  DASHBOARD_ID,
  VISUALISATION,
  VISUALISATION_ID,
  QUERY,
  QUERY_ID,
  EXPORT_REST,
  EXPORT_REST_ID,
  DOWNLOAD_REST,
  DOWNLOAD_REST_ID,
  RESTIFY_PREFIX,
} from 'lib/constants/routes';
import {
  isNativeDashboardRouterEnabled,
  isNativeVisualisationRouterEnabled,
  isNativeQueryRouterEnabled,
  isNativeExportRouterEnabled,
  isNativeDownloadRouterEnabled,
} from './analyticsFlags';

describe('native analytics GET router contracts', () => {
  it('defaults all analytics flags to off', () => {
    assert.strictEqual(isNativeDashboardRouterEnabled({}), false);
    assert.strictEqual(isNativeVisualisationRouterEnabled({}), false);
    assert.strictEqual(isNativeQueryRouterEnabled({}), false);
    assert.strictEqual(isNativeExportRouterEnabled({}), false);
    assert.strictEqual(isNativeDownloadRouterEnabled({}), false);
  });

  it('freezes /v2 analytics paths', () => {
    assert.strictEqual(DASHBOARD, `${RESTIFY_PREFIX}/dashboard`);
    assert.strictEqual(DASHBOARD_ID, `${RESTIFY_PREFIX}/dashboard/:id`);
    assert.strictEqual(VISUALISATION, `${RESTIFY_PREFIX}/visualisation`);
    assert.strictEqual(VISUALISATION_ID, `${RESTIFY_PREFIX}/visualisation/:id`);
    assert.strictEqual(QUERY, `${RESTIFY_PREFIX}/query`);
    assert.strictEqual(QUERY_ID, `${RESTIFY_PREFIX}/query/:id`);
    assert.strictEqual(EXPORT_REST, `${RESTIFY_PREFIX}/export`);
    assert.strictEqual(EXPORT_REST_ID, `${RESTIFY_PREFIX}/export/:id`);
    assert.strictEqual(DOWNLOAD_REST, `${RESTIFY_PREFIX}/download`);
    assert.strictEqual(DOWNLOAD_REST_ID, `${RESTIFY_PREFIX}/download/:id`);
  });
});
