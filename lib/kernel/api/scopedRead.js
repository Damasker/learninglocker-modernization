import boolean from 'boolean';
import { get } from 'lodash';

/**
 * Combine auth scopeFilter with optional request filter for native GET reads.
 */
export const buildScopedReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};

/**
 * Feature flag helper — defaults to false when unset.
 */
export const isEnvFlagEnabled = (flagName, env = process.env) =>
  boolean(get(env, flagName, false));
