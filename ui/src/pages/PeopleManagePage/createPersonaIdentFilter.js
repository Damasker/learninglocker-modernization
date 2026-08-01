// @ll-compat-audit: ok 2026-08-01
import { Map } from 'immutable';

export default personaId => new Map({ persona: new Map({ $oid: personaId }) });
