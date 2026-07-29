import boolean from 'boolean';
import { get } from 'lodash';

/**
 * Feature flag for native LRS GET router beside restify.
 * Default off — restify remains the sole /v2/lrs read path.
 */
export const isNativeLrsRouterEnabled = (
  env = process.env
) => boolean(get(env, 'ENABLE_NATIVE_LRS_ROUTER', false));

export const LRS_MODEL_NAME = 'lrs';

/**
 * Build a scoped Mongo filter for LRS reads.
 */
export const buildLrsReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};
