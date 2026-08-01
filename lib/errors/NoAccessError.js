// @ll-compat-audit: ok 2026-08-01
import BaseError from './BaseError';

export default class extends BaseError {
  constructor() {
    super('Priviliges not sufficient for this operation');
  }
}
