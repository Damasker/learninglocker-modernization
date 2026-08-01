// @ll-compat-audit: ok 2026-08-01
import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: QueryBuilderCacheValue,
  modelName: 'querybuildercachevalue',
  entityLabel: 'QueryBuilderCacheValue',
});
