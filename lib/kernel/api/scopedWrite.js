import getOrgFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getOrgFromAuthInfo';
import getTokenTypeFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getTokenTypeFromAuthInfo';

/**
 * Mirror restify `checkOrg` for models with a singular `organisation` path.
 * Leaves bodies unchanged when the model has no organisation field.
 */
export const applyOrganisationToBody = ({ Model, authInfo, body = {} }) => {
  const next = { ...body };
  if (!Model.schema.path('organisation')) {
    return next;
  }

  const tokenOrg = getOrgFromAuthInfo(authInfo);
  const tokenType = getTokenTypeFromAuthInfo(authInfo);

  if (!next.organisation) {
    next.organisation = tokenOrg;
    return next;
  }

  if (tokenType === 'organisation' || tokenType === 'client') {
    next.organisation = tokenOrg;
  }

  return next;
};

/**
 * Strip restify/mongoose bookkeeping fields that create/update must ignore.
 */
export const stripMutableIds = ({ Model, body = {} }) => {
  const next = { ...body };
  if (Model.schema.options._id) {
    delete next._id;
  }
  const versionKey = Model.schema.options.versionKey;
  if (versionKey) {
    delete next[versionKey];
  }
  return next;
};
