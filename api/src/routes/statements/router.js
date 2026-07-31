import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import StatementRestController from 'api/controllers/StatementRestController';

export default createScopedGetRouter({
  listPath: routes.STATEMENT_REST,
  idPath: routes.STATEMENT_REST_ID,
  listHandler: StatementRestController.list,
  getByIdHandler: StatementRestController.getById,
});
