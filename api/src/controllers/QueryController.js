// @ll-compat-audit: ok 2026-08-01
import Query from 'lib/models/query';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Query,
  modelName: 'query',
  entityLabel: 'Query',
});
