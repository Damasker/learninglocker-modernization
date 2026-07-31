# ADR 0017: Native Statement / BatchDelete write surface behind existing flags

## Status

Accepted

## Context

ADR 0016 moved native writes behind `ENABLE_NATIVE_*_ROUTER` for ordinary
models. Statement and BatchDelete still mixed GET (native when on) with
restify-owned write hooks (405 / gated delete / specialised POSTs). That split
breaks the “one flag owns the HTTP surface” rule used by the UI canary.

Compatibility freeze still forbids changing statement Mongo shape, Redis notify
channels, or queue names. Write *semantics* must stay identical to restify.

## Decision

1. When `ENABLE_NATIVE_STATEMENT_ROUTER=true`, native router also mounts:
   - POST/PUT/PATCH → **405** (same as restify `preCreate` / `preUpdate`)
   - DELETE `/:id` → gated by `ENABLE_STATEMENT_DELETION`, then
     `getScopeFilter({ actionName: 'delete' })` + document remove (204)
2. When `ENABLE_NATIVE_BATCH_DELETE_ROUTER=true`, native router mounts
   POST/PUT/PATCH/DELETE → **405**. Specialised POSTs
   (`/v2/batchdelete/initialise`, `terminate`, …) stay on existing controllers.
3. Defaults remain **off**; lab modern overlay stays **on**.
4. Do not change statement document shape, notify, or queue contracts.

## Consequences

### Positive

- Flag-on traffic no longer falls through to restify for Statement/BatchDelete
  write verbs.
- Dual-run can assert 405 / gated-delete status parity.

### Negative

- Actual Statement deletion still requires `statements/delete` scope (unchanged).
- BatchDelete mutations remain on specialised routes, not `/v2/batchdelete` CRUD.
