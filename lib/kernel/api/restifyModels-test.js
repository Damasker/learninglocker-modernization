import assert from 'assert';
import { RESTIFY_PREFIX, CONNECTION, INDEXES } from 'lib/constants/routes';
import {
  RESTIFY_V2_MODELS,
  RESTIFY_CONNECTION_MODELS,
  getRestifyRouteSuffix,
} from './restifyModels';

describe('restify /v2 model registry', () => {
  it('freezes RESTIFY_PREFIX and connection/index bases', () => {
    assert.strictEqual(RESTIFY_PREFIX, '/v2');
    assert.strictEqual(CONNECTION, '/connection');
    assert.strictEqual(INDEXES, '/indexes');
  });

  it('includes core LRS models required for safe modernization', () => {
    const names = RESTIFY_V2_MODELS.map(model => model.modelName);
    [
      'Organisation',
      'LRS',
      'Client',
      'Statement',
      'Role',
      'User',
      'BatchDelete',
    ].forEach((required) => {
      assert.ok(names.includes(required), `missing ${required}`);
    });
  });

  it('derives connection model list and lowercase suffixes', () => {
    assert.ok(RESTIFY_CONNECTION_MODELS.includes('Statement'));
    assert.ok(!RESTIFY_CONNECTION_MODELS.includes('Stream'));
    assert.ok(!RESTIFY_CONNECTION_MODELS.includes('SiteSettings'));
    assert.strictEqual(getRestifyRouteSuffix('QueryBuilderCacheValue'), 'querybuildercachevalue');
  });
});
