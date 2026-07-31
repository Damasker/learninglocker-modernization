# ADR 0016: Native `/v2` write stranglers behind existing router flags

## Status

Accepted

## Context

ADR 0014/0015 landed feature-flagged native GET routers for all restify `/v2`
models. Writes (POST/PUT/PATCH/DELETE) still hit `express-restify-mongoose`.
UI canary traffic on modern (stage 2) needs create/update/delete to follow the
same kernel `getScopeFilter` path as reads when flags are on; otherwise mixed
read/write handlers diverge under one flag.

## Decision

When `ENABLE_NATIVE_*_ROUTER=true`, the native router owns full CRUD for that
model (not GET-only):

- Shared factories: `createScopedWriteController` /
  `createScopedCrudController`, mounted via extended `createScopedGetRouter`
- Scope actions match restify: `create` / `edit` / `delete`
- Organisation body injection mirrors restify `checkOrg` for singular
  `organisation` fields (`lib/kernel/api/scopedWrite.js`)
- Organisation expiration remains site-admin-only (`beforeUpdate`)
- Defaults stay **off** in code; lab modern overlay remains **on**

Exceptions (special write semantics, still native when flag on — ADR 0017):

- **Statement** — create/update 405; delete gated by `ENABLE_STATEMENT_DELETION`
- **BatchDelete** — create/update/delete 405; specialised POSTs stay custom

## Consequences

### Positive

- One flag per model flips reads and writes together for UI canary.
- Restify remains mounted as rollback when the flag is off.

### Negative

- Dual-run must cover write status parity (dashboard + user + statement/batchdelete
  405 smokes) in addition to GET.
