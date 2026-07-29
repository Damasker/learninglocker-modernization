import boolean from 'boolean';
import { get } from 'lodash';

export const isNativeUserRouterEnabled = (
  env = process.env
) => boolean(get(env, 'ENABLE_NATIVE_USER_ROUTER', false));

export const USER_MODEL_NAME = 'user';

export const buildUserReadFilter = ({ scopeFilter, requestFilter = {} }) => {
  const and = [scopeFilter];
  if (requestFilter && Object.keys(requestFilter).length > 0) {
    and.push(requestFilter);
  }
  return { $and: and };
};
