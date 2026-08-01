// @ll-compat-audit: ok 2026-08-01
import SiteSettings from 'lib/models/siteSettings';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';

export default createScopedCrudController({
  Model: SiteSettings,
  modelName: 'sitesettings',
  entityLabel: 'SiteSettings',
});
