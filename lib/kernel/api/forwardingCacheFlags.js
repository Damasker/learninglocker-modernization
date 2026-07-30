import { isEnvFlagEnabled } from './scopedRead';

export const isNativeStatementForwardingRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER', env);

export const isNativeQueryBuilderCacheRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER', env);

export const isNativeQueryBuilderCacheValueRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER', env);
