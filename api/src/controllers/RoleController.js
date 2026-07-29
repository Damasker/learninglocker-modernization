import mongoose from 'mongoose';
import Role from 'lib/models/role';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import {
  ROLE_MODEL_NAME,
  buildRoleReadFilter,
} from 'lib/kernel/api/role';

const objectId = mongoose.Types.ObjectId;

const getRoles = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: ROLE_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
  const parsedFilter = await parseQuery(reqFilter, { authInfo });
  const filter = buildRoleReadFilter({
    scopeFilter,
    requestFilter: parsedFilter,
  });

  const roles = await Role.find(filter).exec();
  return res.status(200).send(roles);
});

const getRole = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: ROLE_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`Role not found for id ${req.params.id}`);
  }

  const filter = buildRoleReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const role = await Role.findOne(filter).exec();
  if (!role) {
    throw new NotFoundError(`Role not found for id ${req.params.id}`);
  }

  return res.status(200).send(role);
});

export default {
  getRoles,
  getRole,
};
