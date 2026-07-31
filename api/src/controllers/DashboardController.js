import Dashboard from 'lib/models/dashboard';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Dashboard,
  modelName: 'dashboard',
  entityLabel: 'Dashboard',
});
