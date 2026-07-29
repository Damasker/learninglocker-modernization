import Query from 'lib/models/query';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Query,
  modelName: 'query',
  entityLabel: 'Query',
});
