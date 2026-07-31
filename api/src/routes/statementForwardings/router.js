import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import StatementForwardingRestController from 'api/controllers/StatementForwardingRestController';

export default createScopedGetRouter({
  listPath: routes.STATEMENT_FORWARDING,
  idPath: routes.STATEMENT_FORWARDING_ID,
  listHandler: StatementForwardingRestController.list,
  getByIdHandler: StatementForwardingRestController.getById,
  createHandler: StatementForwardingRestController.create,
  updateHandler: StatementForwardingRestController.update,
  deleteHandler: StatementForwardingRestController.remove,
});