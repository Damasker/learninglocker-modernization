import PersonasImportTemplate from 'lib/models/personasImportTemplate';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: PersonasImportTemplate,
  modelName: 'personasimporttemplate',
  entityLabel: 'PersonasImportTemplate',
});
