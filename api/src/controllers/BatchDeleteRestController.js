import BatchDelete from 'lib/models/batchDelete';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: BatchDelete,
  modelName: 'batchdelete',
  entityLabel: 'BatchDelete',
});
