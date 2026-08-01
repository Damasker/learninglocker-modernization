// @ll-compat-audit: ok 2026-08-01
import set from 'lodash/set';

export default (authInfo, organisationId) => {
  const nextAuthInto = set(authInfo, ['token', 'organisationId'], organisationId);
  return nextAuthInto;
};
