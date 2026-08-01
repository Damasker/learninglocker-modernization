// @ll-compat-audit: ok 2026-08-01
import LRS from 'lib/models/lrs';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';
import {
  LRS_MODEL_NAME,
  buildLrsReadFilter,
} from 'lib/kernel/api/lrs';

const handlers = createScopedCrudController({
  Model: LRS,
  modelName: LRS_MODEL_NAME,
  entityLabel: 'LRS',
  buildFilter: buildLrsReadFilter,
});

export default {
  getLrsList: handlers.list,
  getLrs: handlers.getById,
  createLrs: handlers.create,
  updateLrs: handlers.update,
  deleteLrs: handlers.remove,
};
