import PersonaAttribute from 'lib/models/personaAttribute';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: PersonaAttribute,
  modelName: 'personaattribute',
  entityLabel: 'PersonaAttribute',
});
