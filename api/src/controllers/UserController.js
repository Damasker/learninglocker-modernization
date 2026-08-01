// @ll-compat-audit: ok 2026-08-01
import mongoose from 'mongoose';
import { pick } from 'lodash';
import User from 'lib/models/user';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import {
  getScopeFilter,
  getScopeSelect,
  getUserIdFromAuthInfo,
} from 'lib/kernel/auth';
import {
  USER_MODEL_NAME,
  buildUserReadFilter,
} from 'lib/kernel/api/user';
import {
  pickUserCreateBody,
  pickUserUpdateBody,
  applyOrganisationsToUserCreateBody,
  toManagerUserResponse,
} from 'lib/kernel/api/userWrite';
import { stripMutableIds } from 'lib/kernel/api/scopedWrite';

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

const createUser = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  await getScopeFilter({
    modelName: USER_MODEL_NAME,
    actionName: 'create',
    authInfo,
    body: req.body,
  });

  let body = pickUserCreateBody({ body: req.body || {}, authInfo });
  body = await applyOrganisationsToUserCreateBody({ authInfo, body });
  body = stripMutableIds({ Model: User, body });

  const user = await User.create(body);
  return res.status(201).send(toManagerUserResponse(user));
});

const updateUser = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: USER_MODEL_NAME,
    actionName: 'edit',
    authInfo,
    body: req.body,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  const filter = buildUserReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const user = await User.findOne(filter).exec();
  if (!user) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  // Match restify User preUpdate: field pick only (no checkOrg on update).
  let body = pickUserUpdateBody({ body: req.body || {}, authInfo });
  body = stripMutableIds({ Model: User, body });

  // Self-write scope strip (model.writeScopeChecks parity for own id).
  const authUserId = getUserIdFromAuthInfo(authInfo);
  if (authUserId && req.params.id.toString() === authUserId.toString()) {
    body = pick(body, Object.keys(body).filter(k => k !== 'scopes'));
  }

  Object.keys(body).forEach((key) => {
    user.set(key, body[key]);
  });
  const saved = await user.save();
  return res.status(200).send(toManagerUserResponse(saved));
});

const deleteUser = catchErrors(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('API does not allow bulk deletions');
  }

  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: USER_MODEL_NAME,
    actionName: 'delete',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  const filter = buildUserReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const user = await User.findOne(filter).exec();
  if (!user) {
    throw new NotFoundError(`User not found for id ${req.params.id}`);
  }

  if (User.auditRemove) {
    await User.auditRemove(user, req.user);
  }

  await user.remove();
  return res.sendStatus(204);
});

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
