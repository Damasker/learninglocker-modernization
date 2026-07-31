import PersonasImportTemplate from 'lib/models/personasImportTemplate';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: PersonasImportTemplate,
  modelName: 'personasimporttemplate',
  entityLabel: 'PersonasImportTemplate',
});
