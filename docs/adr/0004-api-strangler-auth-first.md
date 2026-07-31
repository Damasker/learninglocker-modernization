# ADR 0004: API strangler starts at auth and scope filters

## Status

Accepted

## Context

The Learning Locker HTTP API (`api/src/routes/HttpRoutes.js`) mixes Passport strategies, JWT/client token shapes, `express-restify-mongoose` CRUD, and custom statement aggregate/count endpoints. Auth scope filters under `lib/services/auth/` are the real authorization contract for `/v2` and persona routes.

A big-bang Express/Fastify rewrite would risk silent authorization regressions. Worker strangler already proved a safer pattern: freeze contracts, expose a kernel entry surface, keep call sites thin.

## Decision

1. Introduce `lib/kernel/auth/` as the stable import surface for auth selectors, scope filters, and scope constants used by API routes/controllers.
2. Freeze durable scope string values (especially xAPI and `site_admin`) with contract tests.
3. Keep `lib/services/auth/**` implementations in place initially; kernel re-exports without behavior change.
4. Strangle API in this order: auth/scopes → statement aggregate/count → gradual `/v2` restify replacement.
5. Do not change Passport strategy names, JWT claim shapes, or scope string values without dual-run parity.

## Consequences

### Positive

- Future Fastify/Express parallel routers can depend on one auth kernel.
- Scope typos/renames fail tests before production.

### Negative

- Temporary double path (`lib/services/auth` + `lib/kernel/auth`) until call sites migrate.
- Restify replacement remains deferred.
