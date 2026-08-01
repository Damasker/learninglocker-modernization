// @ll-compat-audit: ok 2026-08-01
import testOrgScopeFilter
  from 'lib/services/auth/tests/utils/testOrgScopeFilter';

export default (modelName, scopes, expectedScopeFilter) => {
  testOrgScopeFilter(modelName, 'view', scopes, expectedScopeFilter);
  testOrgScopeFilter(modelName, 'edit', scopes, expectedScopeFilter);
  testOrgScopeFilter(modelName, 'create', scopes, expectedScopeFilter);
  testOrgScopeFilter(modelName, 'delete', scopes, expectedScopeFilter);
};
