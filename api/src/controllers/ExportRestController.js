import Export from 'lib/models/export';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Export,
  modelName: 'export',
  entityLabel: 'Export',
});
