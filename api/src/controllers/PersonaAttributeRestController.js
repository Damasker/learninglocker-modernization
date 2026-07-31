import PersonaAttribute from 'lib/models/personaAttribute';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: PersonaAttribute,
  modelName: 'personaattribute',
  entityLabel: 'PersonaAttribute',
});
