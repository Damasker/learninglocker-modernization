import assert from 'assert';
import {
  PERSONA_ATTRIBUTE,
  PERSONAS_IMPORT,
  PERSONAS_IMPORT_ID,
  PERSONAS_IMPORT_TEMPLATE,
  PERSONAS_IMPORT_TEMPLATE_ID,
  IMPORT_CSV,
  IMPORT_CSV_ID,
  RESTIFY_PREFIX,
} from 'lib/constants/routes';
import {
  isNativePersonaAttributeRouterEnabled,
  isNativePersonasImportRouterEnabled,
  isNativePersonasImportTemplateRouterEnabled,
  isNativeImportCsvRouterEnabled,
} from './personaImportFlags';

describe('native persona-import GET router contracts', () => {
  it('defaults all persona-import flags to off', () => {
    assert.strictEqual(isNativePersonaAttributeRouterEnabled({}), false);
    assert.strictEqual(isNativePersonasImportRouterEnabled({}), false);
    assert.strictEqual(isNativePersonasImportTemplateRouterEnabled({}), false);
    assert.strictEqual(isNativeImportCsvRouterEnabled({}), false);
  });

  it('freezes /v2 persona-import paths', () => {
    assert.strictEqual(PERSONA_ATTRIBUTE, `${RESTIFY_PREFIX}/personaattribute`);
    assert.strictEqual(PERSONAS_IMPORT, `${RESTIFY_PREFIX}/personasimport`);
    assert.strictEqual(PERSONAS_IMPORT_ID, `${RESTIFY_PREFIX}/personasimport/:id`);
    assert.strictEqual(PERSONAS_IMPORT_TEMPLATE, `${RESTIFY_PREFIX}/personasimporttemplate`);
    assert.strictEqual(PERSONAS_IMPORT_TEMPLATE_ID, `${RESTIFY_PREFIX}/personasimporttemplate/:id`);
    assert.strictEqual(IMPORT_CSV, `${RESTIFY_PREFIX}/importcsv`);
    assert.strictEqual(IMPORT_CSV_ID, `${RESTIFY_PREFIX}/importcsv/:id`);
  });
});
