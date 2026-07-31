import mongoose from 'mongoose';
import Organisation from 'lib/models/organisation';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import {
  ORGANISATION_MODEL_NAME,
  buildOrganisationReadFilter,
} from 'lib/kernel/api/organisation';

const objectId = mongoose.Types.ObjectId;

const getOrganisations = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: ORGANISATION_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
  const parsedFilter = await parseQuery(reqFilter, { authInfo });
  const filter = buildOrganisationReadFilter({
    scopeFilter,
    requestFilter: parsedFilter,
  });

  const organisations = await Organisation.find(filter).exec();
  return res.status(200).send(organisations);
});

const getOrganisation = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: ORGANISATION_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`Organisation not found for id ${req.params.id}`);
  }

  const filter = buildOrganisationReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const organisation = await Organisation.findOne(filter).exec();
  if (!organisation) {
    throw new NotFoundError(`Organisation not found for id ${req.params.id}`);
  }

  return res.status(200).send(organisation);
});

export default {
  getOrganisations,
  getOrganisation,
};
