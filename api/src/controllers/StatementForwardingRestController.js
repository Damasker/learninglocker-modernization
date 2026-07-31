import StatementForwarding from 'lib/models/statementForwarding';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: StatementForwarding,
  modelName: 'statementforwarding',
  entityLabel: 'StatementForwarding',
});
