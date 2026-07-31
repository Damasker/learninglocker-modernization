# ADR 0021: Persona and PersonaIdentifier dedicated routers are always-on native

## Status

Accepted

## Context

Unlike restify `/v2` models, `Persona` and `PersonaIdentifier` were never mounted
via `express-restify-mongoose`. They already use dedicated Express routers:

- `api/src/routes/personas/personaRESTHandler.js`
- `api/src/routes/personas/personaIdentifierRESTHandler.js`

`HttpRoutes.js` mounts both unconditionally (no feature flag). There is no
restify fallback. Adding `ENABLE_NATIVE_PERSONA_ROUTER` with flag-off would
remove the persona HTTP surface entirely — unsafe and unnecessary.

Related restify persona-import models (`personaattribute`, `personasimport`, …)
already have their own `ENABLE_NATIVE_*` flags (ADR 0010).

## Decision

1. Document Persona / PersonaIdentifier routers as **always-on native** ownership.
2. Do **not** add a gate flag.
3. Keep mounts unconditional in `HttpRoutes.js` (optional clarifying comment).
4. Add lab dual-run smoke (org JWT GETs + connection helpers) so both lab hosts
   prove the same dedicated routers against golden persona fixtures.
5. Do not change persona Mongo shape, persona-service DB wiring (ADR 0012),
   paths, or scope filters.

## Consequences

### Positive

- Inventory “remaining” persona gap is closed without a disabling flag.
- Dual-run catches host/regression drift on a critical UI path.

### Negative

- No flag-off rollback path (never existed for these routes).
- Persona import uploads / merge remain separate always-on mounts.
