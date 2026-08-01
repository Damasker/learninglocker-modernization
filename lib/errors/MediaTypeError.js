// @ll-compat-audit: ok 2026-08-01
import BaseError from './BaseError';

export default class extends BaseError {
  constructor(err) {
    super(err.message);
  }
}
