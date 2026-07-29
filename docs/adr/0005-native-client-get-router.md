# ADR 0005: Feature-flag native Client GET beside restify

## Status

Accepted

## Context

`express-restify-mongoose` mounts Client at `/v2/client`. Replacing restify in one step risks authorization and response-shape regressions. Persona routes already show a successful custom-router pattern using `getScopeFilter`.

## Decision

1. Add a native Express router for **GET list** and **GET by id** only.
2. Gate it with `ENABLE_NATIVE_CLIENT_ROUTER` (default `false`).
3. Mount the native router before restify so Express method+path matching serves GETs natively when enabled; writes remain on restify.
4. Reuse `lib/kernel/auth` `getScopeFilter` with `modelName: 'client'` and `actionName: 'view'`.
5. Keep response documents as Mongoose JSON (restify-like `_id`), not persona `id` remapping.

## Consequences

### Positive

- Dual-run possible: compare restify vs native with the flag.
- Scope filter path matches other native controllers.

### Negative

- Two code paths until writes are also migrated and restify Client mount is removed.
- Flag must be documented in lab overlays when testing.
