# ADR 0007: Feature-flag native Organisation GET beside restify

## Status

Accepted

## Context

Client and LRS GET stranglers (ADR 0005/0006) cover auth-adjacent store/client reads. Organisation is the remaining auth-adjacent restify model in step 2 of the inventory. Organisation scope filters are special: view returns `{ _id: { $in: viewableOrgs } }` (or `{}` for site admin), not an `organisation` field match.

## Decision

1. Add a native Express router for Organisation **GET list** and **GET by id** only.
2. Gate it with `ENABLE_NATIVE_ORGANISATION_ROUTER` (default `false`).
3. Mount before restify when enabled; writes (including site-admin expiration `preUpdate`) remain on restify.
4. Reuse `lib/kernel/auth` `getScopeFilter` with `modelName: 'organisation'` and `actionName: 'view'`.
5. Keep Mongoose JSON response shape (`_id`).

## Consequences

### Positive

- Completes auth-adjacent GET strangler set for dual-run.
- Organisation view scopes stay in the existing filter implementation.

### Negative

- Organisation write/create/delete still on restify until a later slice.
