import boolean from 'boolean';
import { get } from 'lodash';

export const isNativeRoleRouterEnabled = (
  env = process.env
) => boolean(get(env, 'ENABLE_NATIVE_ROLE_ROUTER', false));

export const ROLE_MODEL_NAME = 'role';

export const buildRoleReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};
