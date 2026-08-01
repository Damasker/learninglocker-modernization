// @ll-compat-audit: ok 2026-08-01
import Dashboard from 'lib/models/dashboard';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Dashboard,
  modelName: 'dashboard',
  entityLabel: 'Dashboard',
});
