import boolean from 'boolean';
import { get } from 'lodash';

/**
 * Feature flag for native Organisation GET router beside restify.
 * Default off — restify remains the sole /v2/organisation read path.
 */
export const isNativeOrganisationRouterEnabled = (
  env = process.env
) => boolean(get(env, 'ENABLE_NATIVE_ORGANISATION_ROUTER', false));

export const ORGANISATION_MODEL_NAME = 'organisation';

/**
 * Build a scoped Mongo filter for Organisation reads.
 */
export const buildOrganisationReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};
