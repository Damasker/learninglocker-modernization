// @ll-compat-audit: ok 2026-08-01
import PersonaAttribute from 'lib/models/personaAttribute';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: PersonaAttribute,
  modelName: 'personaattribute',
  entityLabel: 'PersonaAttribute',
});
