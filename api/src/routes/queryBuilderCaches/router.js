import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import QueryBuilderCacheRestController from 'api/controllers/QueryBuilderCacheRestController';

export default createScopedGetRouter({
  listPath: routes.QUERY_BUILDER_CACHE,
  idPath: routes.QUERY_BUILDER_CACHE_ID,
  listHandler: QueryBuilderCacheRestController.list,
  getByIdHandler: QueryBuilderCacheRestController.getById,
  createHandler: QueryBuilderCacheRestController.create,
  updateHandler: QueryBuilderCacheRestController.update,
  deleteHandler: QueryBuilderCacheRestController.remove,
});