# ADR 0008: Feature-flag native Role and User GET beside restify

## Status

Accepted

## Context

Inventory step 3 is Role / User after auth-adjacent Client/LRS/Organisation GET stranglers. User reads additionally apply `getScopeSelect` (MANAGER vs limited field set), which restify applies via `contextFilter`.

## Decision

1. Add native Express GET list/by-id routers for Role and User.
2. Gate with `ENABLE_NATIVE_ROLE_ROUTER` and `ENABLE_NATIVE_USER_ROUTER` (default `false`).
3. Mount before restify when enabled; writes remain on restify (User `preCreate`/`preUpdate` field stripping stays on restify).
4. User reads call `getScopeSelect` from `lib/kernel/auth` and `.select(...)` when present.
5. Role reads use `getScopeFilter` only (no special select).

## Consequences

### Positive

- Completes inventory step 3 for dual-run.
- User field projection parity with restify scope select.

### Negative

- User write path complexity remains on restify until a later slice.
