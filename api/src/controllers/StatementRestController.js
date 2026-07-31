import Statement from 'lib/models/statement';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Statement,
  modelName: 'statement',
  entityLabel: 'Statement',
});
