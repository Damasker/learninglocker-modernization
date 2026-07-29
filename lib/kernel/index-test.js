import assert from 'assert';
import {
  PersonaConflict,
  PersonaNoModelWithId,
  PersonaHasIdentsError,
  Locked,
} from './persona/errors';
import { CursorDirection } from './persona/constants';
import {
  validateMailto,
  validateIri,
  validateSha1,
} from './xapiValidation/regex';
import { authority } from './xapiValidation/factory';
import { XTypeWarning } from './xapiValidation/warnings';

describe('lib/kernel facades', () => {
  it('re-exports persona error constructors', () => {
    assert.equal(typeof PersonaConflict, 'function');
    assert.equal(typeof PersonaNoModelWithId, 'function');
    assert.equal(typeof PersonaHasIdentsError, 'function');
    assert.equal(typeof Locked, 'function');
  });

  it('re-exports CursorDirection', () => {
    assert.strictEqual(CursorDirection.FORWARDS, 0);
    assert.strictEqual(CursorDirection.BACKWARDS, 1);
  });

  it('re-exports xapi validation helpers', () => {
    assert.equal(typeof validateMailto, 'function');
    assert.equal(typeof validateIri, 'function');
    assert.equal(typeof validateSha1, 'function');
    assert.equal(typeof authority, 'function');
    assert.equal(typeof XTypeWarning, 'function');
  });
});
