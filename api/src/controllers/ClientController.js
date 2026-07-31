import Client from 'lib/models/client';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';
import {
  CLIENT_MODEL_NAME,
  buildClientReadFilter,
} from 'lib/kernel/api/client';

const handlers = createScopedCrudController({
  Model: Client,
  modelName: CLIENT_MODEL_NAME,
  entityLabel: 'Client',
  buildFilter: buildClientReadFilter,
});

export default {
  getClients: handlers.list,
  getClient: handlers.getById,
  createClient: handlers.create,
  updateClient: handlers.update,
  deleteClient: handlers.remove,
};
