import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import ExportRestController from 'api/controllers/ExportRestController';

export default createScopedGetRouter({
  listPath: routes.EXPORT_REST,
  idPath: routes.EXPORT_REST_ID,
  listHandler: ExportRestController.list,
  getByIdHandler: ExportRestController.getById,
  createHandler: ExportRestController.create,
  updateHandler: ExportRestController.update,
  deleteHandler: ExportRestController.remove,
});