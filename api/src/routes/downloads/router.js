import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import DownloadRestController from 'api/controllers/DownloadRestController';

export default createScopedGetRouter({
  listPath: routes.DOWNLOAD_REST,
  idPath: routes.DOWNLOAD_REST_ID,
  listHandler: DownloadRestController.list,
  getByIdHandler: DownloadRestController.getById,
});
