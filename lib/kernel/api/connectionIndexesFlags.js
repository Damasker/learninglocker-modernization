import { isEnvFlagEnabled } from './scopedRead';

export const isNativeConnectionIndexesRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_CONNECTION_INDEXES_ROUTER', env);
