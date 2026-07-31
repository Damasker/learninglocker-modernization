import { isEnvFlagEnabled } from './scopedRead';

export const isNativeStatementRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_STATEMENT_ROUTER', env);

export const isNativeStatementAggregateRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_STATEMENT_AGGREGATE_ROUTER', env);
