// @ll-compat-audit: ok 2026-08-01
import BaseError from './BaseError';

export default class RequestAppAccessError extends BaseError {
  constructor() {
    super('Access request failed');
  }
}
