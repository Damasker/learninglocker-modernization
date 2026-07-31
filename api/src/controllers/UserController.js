import mongoose from 'mongoose';
import User from 'lib/models/user';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter, getScopeSelect } from 'lib/kernel/auth';
import {
  USER_MODEL_NAME,
  buildUserReadFilter,
} from 'lib/kernel/api/user';

const objectId = mongoose.Types.ObjectId;

const getUsers = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: USER_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });
  const scopeSelect = await getScopeSelect({
    modelName: USER_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
  const parsedFilter = await parseQuery(reqFilter, { authInfo });
  const filter = buildUserReadFilter({
    scopeFilter,
    requestFilter: parsedFilter,
  });

  let query = User.find(filter);
  if (scopeSelect) {
    query = query.select(scopeSelect);
  }
  const users = await query.exec();
  return res.status(200).send(users);
});

const getUser = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: USER_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });
  const scopeSelect = await getScopeSelect({
    modelName: USER_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  const filter = buildUserReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  let query = User.findOne(filter);
  if (scopeSelect) {
    query = query.select(scopeSelect);
  }
  const user = await query.exec();
  if (!user) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  return res.status(200).send(user);
});

export default {
  getUsers,
  getUser,
};
