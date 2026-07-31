import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import SiteSettingsRestController from 'api/controllers/SiteSettingsRestController';

export default createScopedGetRouter({
  listPath: routes.SITE_SETTINGS,
  idPath: routes.SITE_SETTINGS_ID,
  listHandler: SiteSettingsRestController.list,
  getByIdHandler: SiteSettingsRestController.getById,
  createHandler: SiteSettingsRestController.create,
  updateHandler: SiteSettingsRestController.update,
  deleteHandler: SiteSettingsRestController.remove,
});