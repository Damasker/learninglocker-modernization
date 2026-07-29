import { isEnvFlagEnabled } from './scopedRead';

export const isNativePersonaAttributeRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER', env);

export const isNativePersonasImportRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER', env);

export const isNativePersonasImportTemplateRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER', env);

export const isNativeImportCsvRouterEnabled = (env = process.env) =>
  isEnvFlagEnabled('ENABLE_NATIVE_IMPORT_CSV_ROUTER', env);
