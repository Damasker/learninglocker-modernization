import ImportCsv from 'lib/models/importcsv';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: ImportCsv,
  modelName: 'importcsv',
  entityLabel: 'ImportCsv',
});
