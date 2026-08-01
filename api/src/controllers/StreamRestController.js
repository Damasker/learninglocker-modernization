// @ll-compat-audit: ok 2026-08-01
import Stream from 'lib/models/stream';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Stream,
  modelName: 'stream',
  entityLabel: 'Stream',
});
