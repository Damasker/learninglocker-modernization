import { isEnvFlagEnabled } from './scopedRead';

export const isNativeSiteSettingsRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_SITE_SETTINGS_ROUTER', env);

export const isNativeStreamRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_STREAM_ROUTER', env);

export const isNativeBatchDeleteRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_BATCH_DELETE_ROUTER', env);
