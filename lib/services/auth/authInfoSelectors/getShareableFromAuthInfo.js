// @ll-compat-audit: ok 2026-08-01
import get from 'lodash/get';
import getTokenTypeFromAuthInfo
  from 'lib/services/auth/authInfoSelectors/getTokenTypeFromAuthInfo';

export default (authInfo) => {
  const tokenId = get(authInfo, ['token', 'shareableId']);
  const tokenType = getTokenTypeFromAuthInfo(authInfo);
  if (tokenType === 'dashboard') return tokenId;

  return null;
};
