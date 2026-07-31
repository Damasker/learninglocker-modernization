# ADR 0006: Feature-flag native LRS GET beside restify

## Status

Accepted

## Context

Client GET strangler (ADR 0005) established the pattern for dual-running native Express GETs beside `express-restify-mongoose`. LRS (xAPI store) is next in the auth-adjacent `/v2` replacement order.

## Decision

1. Add a native Express router for LRS **GET list** and **GET by id** only.
2. Gate it with `ENABLE_NATIVE_LRS_ROUTER` (default `false`).
3. Mount before restify when enabled; writes remain on restify.
4. Reuse `lib/kernel/auth` `getScopeFilter` with `modelName: 'lrs'` and `actionName: 'view'`.
5. Keep Mongoose JSON response shape (`_id`), matching restify.

## Consequences

### Positive

- Same dual-run path as Client for store inventory endpoints.
- Scope filters stay centralized in the auth kernel.

### Negative

- Another temporary dual path until LRS writes are migrated.
