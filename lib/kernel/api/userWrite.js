import _ from 'lodash';
import User from 'lib/models/user';
import getOrgFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getOrgFromAuthInfo';
import getTokenTypeFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getTokenTypeFromAuthInfo';
import getUserIdFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getUserIdFromAuthInfo';
import getScopesFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getScopesFromAuthInfo';
import { SITE_ADMIN } from 'lib/constants/scopes';
import { MANAGER_SELECT } from 'lib/services/auth/selects/models/user';
import ClientError from 'lib/errors/ClientError';

/**
 * Restify-parity field pick for User create (non site-admin).
 */
export const pickUserCreateBody = ({ body = {}, authInfo }) => {
  const scopes = getScopesFromAuthInfo(authInfo);
  if (scopes.includes(SITE_ADMIN)) {
    return { ...body };
  }
  return _.pick(body, ['name', 'email', 'isExpanded', 'organisations']);
};

/**
 * Restify-parity field pick for User update (non site-admin).
 */
export const pickUserUpdateBody = ({ body = {}, authInfo }) => {
  const scopes = getScopesFromAuthInfo(authInfo);
  if (scopes.includes(SITE_ADMIN)) {
    return { ...body };
  }

  const tokenType = getTokenTypeFromAuthInfo(authInfo);
  const userId = getUserIdFromAuthInfo(authInfo);
  const isUpdatingItself =
    ['user', 'organisation'].includes(tokenType) &&
    body._id === (userId ? userId.toString() : undefined);

  if (isUpdatingItself) {
    return _.pick(body, ['name', 'password']);
  }
  return _.pick(body, ['name']);
};

/**
 * Mirror restify checkOrg organisations branch for User create.
 * Mutates a copy of body; throws ClientError on validation failure.
 */
export const applyOrganisationsToUserCreateBody = async ({
  authInfo,
  body = {},
  userId,
}) => {
  const next = { ...body };
  const tokenType = getTokenTypeFromAuthInfo(authInfo);
  if (tokenType !== 'organisation' && tokenType !== 'client') {
    return next;
  }

  const tokenOrg = getOrgFromAuthInfo(authInfo);
  if (!tokenOrg) {
    return next;
  }

  let filter;
  if (userId) {
    filter = { _id: userId };
  } else {
    if (!next.email) {
      throw new ClientError('Must have an email to create or update user');
    }
    filter = { email: next.email };
  }

  const userOrg = [tokenOrg.toString()];
  const existingUser = await User.findOne(filter).lean().select({ organisations: 1 }).exec();

  if (!next.organisations) {
    if (existingUser && existingUser.organisations) {
      const existingOrgs = _.without(existingUser.organisations, null, undefined);
      const existingOrgsAsStrings = _.map(existingOrgs, id => id.toString());
      next.organisations = _.union(userOrg, existingOrgsAsStrings);
    } else {
      next.organisations = userOrg;
    }
    return next;
  }

  const requestOrgs = next.organisations;
  if (!Array.isArray(requestOrgs)) {
    throw new ClientError('Invalid organisations array');
  }

  if (_.includes(requestOrgs, tokenOrg.toString())) {
    if (existingUser && existingUser.organisations) {
      const existingOrgs = _.without(existingUser.organisations, null, undefined);
      const existingOrgsAsStrings = _.map(existingOrgs, id => id.toString());
      if (_.includes(existingOrgsAsStrings, tokenOrg.toString())) {
        delete next.organisations;
      } else {
        next.organisations = _.union(userOrg, existingOrgsAsStrings);
      }
    } else {
      next.organisations = userOrg;
    }
    return next;
  }

  if (existingUser && existingUser.organisations) {
    const existingOrgs = _.without(existingUser.organisations, null, undefined);
    const existingOrgsAsStrings = _.map(existingOrgs, id => id.toString());
    next.organisations = _.without(existingOrgsAsStrings, tokenOrg.toString());
    return next;
  }

  throw new ClientError('Cannot create user in a different organisation');
};

/**
 * Shape write responses like restify User postCreate/postUpdate.
 */
export const toManagerUserResponse = (doc) => {
  const plain = doc && typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return _.pick(plain, Object.keys(MANAGER_SELECT));
};
