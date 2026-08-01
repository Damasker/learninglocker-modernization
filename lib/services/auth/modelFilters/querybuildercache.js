// @ll-compat-audit: ok 2026-08-01
import { ALL } from 'lib/constants/scopes';
import getGlobalModelFilter
  from 'lib/services/auth/filters/getGlobalModelFilter';

export default getGlobalModelFilter({
  editAllScopes: [ALL],
});
