import Visualisation from 'lib/models/visualisation';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Visualisation,
  modelName: 'visualisation',
  entityLabel: 'Visualisation',
});
