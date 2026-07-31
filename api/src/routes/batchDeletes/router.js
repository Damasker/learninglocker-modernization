import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import BatchDeleteRestController from 'api/controllers/BatchDeleteRestController';
import BatchDeleteController from 'api/controllers/BatchDeleteController';

const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

const router = createScopedGetRouter({
  listPath: routes.BATCH_DELETE,
  idPath: routes.BATCH_DELETE_ID,
  listHandler: BatchDeleteRestController.list,
  getByIdHandler: BatchDeleteRestController.getById,
  createHandler: BatchDeleteRestController.create,
  updateHandler: BatchDeleteRestController.update,
  deleteHandler: BatchDeleteRestController.remove,
});

// Specialised POSTs (ADR 0018). Mount terminate/all before terminate/:id.
router.post(
  routes.STATEMENT_BATCH_DELETE_INITIALISE,
  auth,
  BatchDeleteController.initialiseBatchDelete
);
router.post(
  routes.STATEMENT_BATCH_DELETE_TERMINATE_ALL,
  auth,
  BatchDeleteController.terminateAllBatchDeletes
);
router.post(
  routes.STATEMENT_BATCH_DELETE_TERMINATE,
  auth,
  BatchDeleteController.terminateBatchDelete
);

export default router;
