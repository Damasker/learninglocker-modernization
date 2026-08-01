// @ll-compat-audit: ok 2026-08-01
import { omit } from 'lodash';
import Organisation from 'lib/models/organisation';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';
import { getScopesFromAuthInfo, SITE_ADMIN } from 'lib/kernel/auth';
import {
  ORGANISATION_MODEL_NAME,
  buildOrganisationReadFilter,
} from 'lib/kernel/api/organisation';

const handlers = createScopedCrudController({
  Model: Organisation,
  modelName: ORGANISATION_MODEL_NAME,
  entityLabel: 'Organisation',
  buildFilter: buildOrganisationReadFilter,
  beforeUpdate: ({ body, authInfo }) => {
    const scopes = getScopesFromAuthInfo(authInfo);
    if (scopes.indexOf(SITE_ADMIN) < 0) {
      return omit(body, 'expiration');
    }
    return body;
  },
});

export default {
  getOrganisations: handlers.list,
  getOrganisation: handlers.getById,
  createOrganisation: handlers.create,
  updateOrganisation: handlers.update,
  deleteOrganisation: handlers.remove,
};
