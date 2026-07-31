import SiteSettings from 'lib/models/siteSettings';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

export default createScopedGetController({
  Model: SiteSettings,
  modelName: 'sitesettings',
  entityLabel: 'SiteSettings',
});
