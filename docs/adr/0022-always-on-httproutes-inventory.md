# ADR 0022: Inventory remaining always-on HttpRoutes (outside restify strangler map)

## Status

Accepted

## Context

ADR 0005–0021 closed the restify `/v2` inventory behind `ENABLE_NATIVE_*_ROUTER`
flags (lab default-on, code defaults off) and documented Persona /
PersonaIdentifier as always-on dedicated routers (ADR 0021).

`HttpRoutes.js` still mounts several **non-restify** surfaces unconditionally.
These were never express-restify-mongoose routes; adding off-by-default flags
would remove working UI/admin paths with no restify fallback.

## Decision

1. Publish `docs/api/always-on-httproutes.md` as the inventory for remaining
   always-on mounts (auth helpers, uploads/downloads, statement metadata,
   user-organisation mutations, merge persona).
2. Do **not** add feature flags for these mounts.
3. Add lab dual-run smoke for idempotent / auth-shape checks (health, version,
   downloadlogo status, statement-metadata auth + golden POST) so both lab
   hosts prove the same handlers.
4. Leave destructive uploads / merge / user-org mutations documented but
   outside automated dual-run (side effects / fixtures).

## Consequences

### Positive

- Clear boundary: restify strangler map is complete; remaining HTTP work is
  catalogued always-on native.
- Dual-run catches host drift on shared always-on GETs/auth.

### Negative

- No flag-off rollback for these paths (same as historical Learning Locker).
- Upload/export binary parity stays manual / soak-driven.
