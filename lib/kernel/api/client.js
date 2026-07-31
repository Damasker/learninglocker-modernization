import boolean from 'boolean';
import { get } from 'lodash';

/**
 * Feature flag for native Client GET router beside restify.
 * Default off — restify remains the sole /v2/client read path.
 */
export const isNativeClientRouterEnabled = (
  env = process.env
) => boolean(get(env, 'ENABLE_NATIVE_CLIENT_ROUTER', false));

export const CLIENT_MODEL_NAME = 'client';

/**
 * Build a scoped Mongo filter for Client reads.
 * Combines auth scopeFilter with optional request filter.
 */
export const buildClientReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};
