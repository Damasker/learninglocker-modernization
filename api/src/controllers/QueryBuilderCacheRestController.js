import QueryBuilderCache from 'lib/models/querybuildercache';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: QueryBuilderCache,
  modelName: 'querybuildercache',
  entityLabel: 'QueryBuilderCache',
});
