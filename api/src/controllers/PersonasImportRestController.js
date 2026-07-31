import PersonasImport from 'lib/models/personasImport';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: PersonasImport,
  modelName: 'personasimport',
  entityLabel: 'PersonasImport',
});
