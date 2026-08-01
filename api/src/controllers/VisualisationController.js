// @ll-compat-audit: ok 2026-08-01
import Visualisation from 'lib/models/visualisation';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Visualisation,
  modelName: 'visualisation',
  entityLabel: 'Visualisation',
});
