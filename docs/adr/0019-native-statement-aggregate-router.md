# ADR 0019: Native statement analytics aggregate router behind a feature flag

## Status

Accepted

## Context

Inventory remaining after ADR 0018 was the four statement analytics GETs:

- `GET /statements/aggregate`
- `GET /statements/aggregateAsync`
- `GET /statements/count`
- `GET /v1/statements/aggregate`

Parsing, formatting, and services already live in `lib/kernel/api/statements*`
(ADR 0004). Controllers are thin HTTP shells. Mounts were always-on in
`HttpRoutes.js`, so flag-on UI/canary could not own the analytics surface the
same way as `/v2` stranglers.

`ENABLE_NATIVE_STATEMENT_ROUTER` owns `/v2/statement` only (ADR 0015/0017) and
must stay separate.

## Decision

1. Add `ENABLE_NATIVE_STATEMENT_AGGREGATE_ROUTER` (code default **off**).
2. When **true**, mount all four GETs on
   `api/src/routes/statementAnalytics/router.js` wired to existing
   `StatementController` handlers (no behavior change).
3. When **false**, keep the existing `HttpRoutes` mounts as fallback.
4. Lab overlays set the flag **on** for modern and **off** for legacy-restify
   (stage 3 pattern).
5. Do not change paths, envelopes, cache TTLs, scope filters, statement Mongo
   shape, Redis notify, or queue names.

## Consequences

### Positive

- One flag owns the analytics HTTP surface for dual-run and canary.
- Controllers/services unchanged; remount-only risk.

### Negative

- A second statement-related flag (aggregate vs `/v2/statement`) must be kept
  in sync in lab overlays / `set-native-get-flags.sh`.
