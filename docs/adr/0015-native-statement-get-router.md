# ADR 0015: Feature-flag native Statement GET router

## Status

Accepted

## Context

Statement is the last restify `/v2` model without a native GET strangler. Create and
update are already blocked (405); delete stays on restify and is gated by
`ENABLE_STATEMENT_DELETION`. Compatibility freeze forbids changing statement Mongo
shape, Redis notify/queue names, or write semantics. Scope filtering already lives
in `lib/services/auth/modelFilters/statement.js` and is reused by restify.

## Decision

1. Add native GET list/by-id for `/v2/statement` behind
   `ENABLE_NATIVE_STATEMENT_ROUTER` (default `false`).
2. Reuse `createScopedGetController` / `createScopedGetRouter` and existing
   `getScopeFilter({ modelName: 'statement', actionName: 'view' })`.
3. Keep restify as fallback when the flag is off. When the flag is on, native
   also owns write verbs (ADR 0017): create/update **405**, delete gated by
   `ENABLE_STATEMENT_DELETION`.
4. Do not alter statement document shape, notify channels, or queue names.
5. Include the flag in lab dual-run / stage-1 modern overlay once verified.

## Consequences

### Positive

- Completes restify GET inventory coverage behind flags.
- Dual-run can compare restify vs native Statement list/by-id status and bodies.

### Negative

- Unfiltered Statement lists can be large; native path matches restify's existing
  unbounded list behaviour for parity.
- Writes and Statement analytics routes (`/statements/aggregate*`) stay separate.
