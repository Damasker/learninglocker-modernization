import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import PersonasImportTemplateController from 'api/controllers/PersonasImportTemplateController';

export default createScopedGetRouter({
  listPath: routes.PERSONAS_IMPORT_TEMPLATE,
  idPath: routes.PERSONAS_IMPORT_TEMPLATE_ID,
  listHandler: PersonasImportTemplateController.list,
  getByIdHandler: PersonasImportTemplateController.getById,
  createHandler: PersonasImportTemplateController.create,
  updateHandler: PersonasImportTemplateController.update,
  deleteHandler: PersonasImportTemplateController.remove,
});