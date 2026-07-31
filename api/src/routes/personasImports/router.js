import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import PersonasImportRestController from 'api/controllers/PersonasImportRestController';

export default createScopedGetRouter({
  listPath: routes.PERSONAS_IMPORT,
  idPath: routes.PERSONAS_IMPORT_ID,
  listHandler: PersonasImportRestController.list,
  getByIdHandler: PersonasImportRestController.getById,
});
