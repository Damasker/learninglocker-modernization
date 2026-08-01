// @ll-compat-audit: ok 2026-08-01
import getScopeFilter from 'lib/services/auth/filters/getScopeFilter';

export default (modelName, actionName, token, user, client = undefined) =>
  getScopeFilter({
    modelName,
    actionName,
    authInfo: { token, user, client },
  });
