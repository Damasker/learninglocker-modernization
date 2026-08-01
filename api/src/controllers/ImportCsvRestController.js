// @ll-compat-audit: ok 2026-08-01
import ImportCsv from 'lib/models/importcsv';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: ImportCsv,
  modelName: 'importcsv',
  entityLabel: 'ImportCsv',
});
