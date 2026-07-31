import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import BatchDeleteRestController from 'api/controllers/BatchDeleteRestController';

export default createScopedGetRouter({
  listPath: routes.BATCH_DELETE,
  idPath: routes.BATCH_DELETE_ID,
  listHandler: BatchDeleteRestController.list,
  getByIdHandler: BatchDeleteRestController.getById,
});
