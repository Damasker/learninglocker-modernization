import Download from 'lib/models/download';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Download,
  modelName: 'download',
  entityLabel: 'Download',
});
