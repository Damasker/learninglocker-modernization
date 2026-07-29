import Download from 'lib/models/download';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Download,
  modelName: 'download',
  entityLabel: 'Download',
});
