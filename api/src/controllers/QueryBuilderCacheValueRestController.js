import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: QueryBuilderCacheValue,
  modelName: 'querybuildercachevalue',
  entityLabel: 'QueryBuilderCacheValue',
});
