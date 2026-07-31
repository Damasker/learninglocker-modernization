import QueryBuilderCache from 'lib/models/querybuildercache';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: QueryBuilderCache,
  modelName: 'querybuildercache',
  entityLabel: 'QueryBuilderCache',
});
