// @ll-compat-audit: ok 2026-08-01
import get from 'lodash/get';

export default authInfo =>
  get(authInfo, ['token', 'filter'], {});
