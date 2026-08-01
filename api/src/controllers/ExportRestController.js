// @ll-compat-audit: ok 2026-08-01
import Export from 'lib/models/export';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: Export,
  modelName: 'export',
  entityLabel: 'Export',
});
