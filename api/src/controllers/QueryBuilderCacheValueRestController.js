import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: QueryBuilderCacheValue,
  modelName: 'querybuildercachevalue',
  entityLabel: 'QueryBuilderCacheValue',
});
