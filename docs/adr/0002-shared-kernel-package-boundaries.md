# ADR 0002: Shared kernel owns Learning Locker package boundaries

## Status

Accepted

## Context

Production code imports `@learninglocker/persona-service` and `@learninglocker/xapi-validation` through deep `dist/` paths. Those packages declare old Node engines and are hard to upgrade in place. Auth and Mongo/Redis connections already act as in-repo shared contracts; the missing choke point is the unmediated package surface.

## Decision

1. Introduce `lib/kernel/` facades for all production `@learninglocker/*` deep imports used by API/lib/UI in this slice.
2. Keep package installs unchanged for now; facades re-export identical symbols/behavior.
3. Preserve `lib/connections/personaService` import path as a stable alias for existing callers.
4. Defer full vendoring/forks of `@learninglocker/*` packages to a later PR.
5. Do not rewrite `lib/services/auth` in this slice.
6. Cover worker statement-forwarding and CLI queriable helpers via `lib/kernel/xapiStatements/*` facades.

## Consequences

### Positive

- One place to swap package implementations later (vendoring/forks).
- Call sites stop proliferating `dist/` paths.
- Behavior remains unchanged if re-exports stay identical.

### Negative

- Temporary indirection until packages are vendored.
- Auth still couples to its existing in-repo modules until a dedicated auth kernel slice.
