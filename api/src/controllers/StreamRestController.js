import Stream from 'lib/models/stream';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: Stream,
  modelName: 'stream',
  entityLabel: 'Stream',
});
