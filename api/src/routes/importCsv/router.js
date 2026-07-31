import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import ImportCsvRestController from 'api/controllers/ImportCsvRestController';

export default createScopedGetRouter({
  listPath: routes.IMPORT_CSV,
  idPath: routes.IMPORT_CSV_ID,
  listHandler: ImportCsvRestController.list,
  getByIdHandler: ImportCsvRestController.getById,
});
