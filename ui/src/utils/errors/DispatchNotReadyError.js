// @ll-compat-audit: ok 2026-08-01
import errorFactory from 'lib/utils/errorFactory';

const DispatchNotReadyError = errorFactory('DispatchNotReadyError');

export default DispatchNotReadyError;
