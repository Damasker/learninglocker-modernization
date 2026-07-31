import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import DashboardController from 'api/controllers/DashboardController';

export default createScopedGetRouter({
  listPath: routes.DASHBOARD,
  idPath: routes.DASHBOARD_ID,
  listHandler: DashboardController.list,
  getByIdHandler: DashboardController.getById,
  createHandler: DashboardController.create,
  updateHandler: DashboardController.update,
  deleteHandler: DashboardController.remove,
});