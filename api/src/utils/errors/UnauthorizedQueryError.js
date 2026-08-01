// @ll-compat-audit: ok 2026-08-01
import errorFactory from 'lib/utils/errorFactory';

const UnauthorizedQueryError = errorFactory('UnauthorizedQueryError');

export default UnauthorizedQueryError;
