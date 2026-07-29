import * as routes from 'lib/constants/routes';
import createScopedGetRouter from 'api/routes/utils/createScopedGetRouter';
import PersonaAttributeRestController from 'api/controllers/PersonaAttributeRestController';

export default createScopedGetRouter({
  listPath: routes.PERSONA_ATTRIBUTE,
  idPath: `${routes.RESTIFY_PREFIX}/personaattribute/:id`,
  listHandler: PersonaAttributeRestController.list,
  getByIdHandler: PersonaAttributeRestController.getById,
});
