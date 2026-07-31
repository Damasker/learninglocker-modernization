import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import VisualisationController from 'api/controllers/VisualisationController';

export default createScopedGetRouter({
  listPath: routes.VISUALISATION,
  idPath: routes.VISUALISATION_ID,
  listHandler: VisualisationController.list,
  getByIdHandler: VisualisationController.getById,
  createHandler: VisualisationController.create,
  updateHandler: VisualisationController.update,
  deleteHandler: VisualisationController.remove,
});