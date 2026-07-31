/**
 * Public auth kernel surface for API/controllers.
 * Implementations remain in lib/services/auth until a later rewrite.
 */
import getScopeFilter from 'lib/services/auth/filters/getScopeFilter';
import getScopeSelect from 'lib/services/auth/selects/getScopeSelect';
import getOrgFromAuthInfo from 'lib/services/auth/authInfoSelectors/getOrgFromAuthInfo';
import getTokenTypeFromAuthInfo from 'lib/services/auth/authInfoSelectors/getTokenTypeFromAuthInfo';
import getScopesFromAuthInfo from 'lib/services/auth/authInfoSelectors/getScopesFromAuthInfo';
import getUserIdFromAuthInfo from 'lib/services/auth/authInfoSelectors/getUserIdFromAuthInfo';
import { MANAGER_SELECT } from 'lib/services/auth/selects/models/user';

export {
  getScopeFilter,
  getScopeSelect,
  getOrgFromAuthInfo,
  getTokenTypeFromAuthInfo,
  getScopesFromAuthInfo,
  getUserIdFromAuthInfo,
  MANAGER_SELECT,
};

export {
  ALL,
  SITE_ADMIN,
  SITE_CAN_CREATE_ORG,
  OBSERVER,
  XAPI_ALL,
  XAPI_READ,
  XAPI_STATEMENTS_READ,
  XAPI_STATEMENTS_WRITE,
  XAPI_STATEMENTS_READ_MINE,
  XAPI_STATE_ALL,
  XAPI_PROFILE_ALL,
  XAPI_STATEMENTS_DELETE,
  XAPI_SCOPES,
  API_SCOPES,
  CLIENT_SCOPES,
  SITE_SCOPES,
  USER_SCOPES,
  VIEW_SHAREABLE_DASHBOARD,
} from './scopes';
