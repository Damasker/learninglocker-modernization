# ADR 0018: Native BatchDelete specialised POSTs behind existing flag

## Status

Accepted

## Context

ADR 0017 moved BatchDelete CRUD verbs to the native router (scope then 405)
but left specialised mutation POSTs on always-on `HttpRoutes` mounts:

- `POST /v2/batchdelete/initialise`
- `POST /v2/batchdelete/terminate/all`
- `POST /v2/batchdelete/terminate/:id`

That split broke the “one flag owns the HTTP surface” rule used by the UI
canary and stage-3 lab default-on. Controllers and mocha coverage already
exist; only mount ownership needed to move.

Compatibility freeze still forbids renaming `BATCH_STATEMENT_DELETION_QUEUE`
or changing statement Mongo / Redis notify contracts.

## Decision

1. When `ENABLE_NATIVE_BATCH_DELETE_ROUTER=true`, the native
   `batchDeletes/router` also mounts the three specialised POSTs, wired to
   existing `BatchDeleteController` handlers (no behavior change). Mount
   `terminate/all` before `terminate/:id`.
2. When the flag is **false**, keep the existing `HttpRoutes` specialised
   mounts as the restify-era fallback.
3. Do not add a second feature flag. Do not move controller logic into the
   kernel in this ADR. Do not change queue names, filters, or schemas.
4. Code default remains **off**; lab modern overlay stays **on**.

## Consequences

### Positive

- Flag-on traffic serves BatchDelete GET, CUD-405, and specialised POSTs from
  one router.
- Dual-run can assert initialise/terminate status parity legacy vs modern.

### Negative

- Restify `BatchDelete` model registration remains for flag-off rollback and
  connection/index helpers.
- Analytics aggregate routes remain a separate strangler (follow-on ADR).
