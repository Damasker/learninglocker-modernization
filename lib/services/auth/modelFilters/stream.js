import getOrgFilter from 'lib/services/auth/filters/getOrgFilter';

/**
 * Stream is org-scoped (filterByOrg on the model) but historically missing
 * from getScopeFilter, so restify GET /v2/stream threw Invalid scope.
 */
export default async ({ authInfo }) => getOrgFilter(authInfo);
