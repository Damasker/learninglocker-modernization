import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import QueryBuilderCacheValueRestController from 'api/controllers/QueryBuilderCacheValueRestController';

export default createScopedGetRouter({
  listPath: routes.QUERY_BUILDER_CACHE_VALUE,
  idPath: routes.QUERY_BUILDER_CACHE_VALUE_ID,
  listHandler: QueryBuilderCacheValueRestController.list,
  getByIdHandler: QueryBuilderCacheValueRestController.getById,
});
