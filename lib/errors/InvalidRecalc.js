// @ll-compat-audit: ok 2026-08-01
import ClientError from './ClientError';

export default class extends ClientError {
  constructor(modelId) {
    super(`Journey (${modelId}) not available for recalculation`);
  }
}
