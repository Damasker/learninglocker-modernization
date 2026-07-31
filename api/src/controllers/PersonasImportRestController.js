import PersonasImport from 'lib/models/personasImport';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: PersonasImport,
  modelName: 'personasimport',
  entityLabel: 'PersonasImport',
});
