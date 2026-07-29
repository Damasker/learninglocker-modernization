import { isEnvFlagEnabled } from './scopedRead';

export const isNativeDashboardRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_DASHBOARD_ROUTER', env);

export const isNativeVisualisationRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_VISUALISATION_ROUTER', env);

export const isNativeQueryRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_QUERY_ROUTER', env);

export const isNativeExportRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_EXPORT_ROUTER', env);

export const isNativeDownloadRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_DOWNLOAD_ROUTER', env);
