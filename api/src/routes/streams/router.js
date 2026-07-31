import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import StreamRestController from 'api/controllers/StreamRestController';

export default createScopedGetRouter({
  listPath: routes.STREAM,
  idPath: routes.STREAM_ID,
  listHandler: StreamRestController.list,
  getByIdHandler: StreamRestController.getById,
  createHandler: StreamRestController.create,
  updateHandler: StreamRestController.update,
  deleteHandler: StreamRestController.remove,
});