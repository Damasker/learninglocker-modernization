import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import QueryController from 'api/controllers/QueryController';

export default createScopedGetRouter({
  listPath: routes.QUERY,
  idPath: routes.QUERY_ID,
  listHandler: QueryController.list,
  getByIdHandler: QueryController.getById,
  createHandler: QueryController.create,
  updateHandler: QueryController.update,
  deleteHandler: QueryController.remove,
});