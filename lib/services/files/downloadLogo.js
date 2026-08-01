// @ll-compat-audit: ok 2026-08-01
import Organisation from 'lib/models/organisation';
import getScopeFilter from 'lib/services/auth/filters/getScopeFilter';
import NotFoundError from 'lib/errors/NotFoundError';

export default async ({ authInfo, orgId }) => {
  const idFilter = { _id: orgId };
  const scopeFilter = await getScopeFilter({
    modelName: 'organisation',
    actionName: 'view',
    authInfo
  });
  const filter = { $and: [idFilter, scopeFilter] };
  const org = await Organisation.findOne(filter).exec();

  if (!org || !org.logo || !org.logo.mime) {
    throw new NotFoundError(`Logo not found for organisation ${orgId}`);
  }

  return {
    mime: org.logo.mime,
    key: `logos/${orgId}`
  };
};
