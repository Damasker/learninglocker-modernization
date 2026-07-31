import StatementForwarding from 'lib/models/statementForwarding';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: StatementForwarding,
  modelName: 'statementforwarding',
  entityLabel: 'StatementForwarding',
});
