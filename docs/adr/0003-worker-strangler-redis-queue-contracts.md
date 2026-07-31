# ADR 0003: Worker strangler preserves Redis notify and queue names

## Status

Accepted

## Context

xAPI ingest lives in `xapi-service`. After store, Learning Locker's worker is woken via Redis pub/sub and drains a Redis list into Bull/queue handlers. Queue name constants (including historical typos) and Redis key suffixes are production contracts shared with xapi-service and existing deployments.

Rewriting worker handlers without freezing these strings would break the golden path even if Mongo statement shape stays identical.

## Decision

1. Treat Redis notify suffixes and queue name string values as frozen compatibility contracts (see `docs/contracts/compatibility-freeze.md`).
2. Centralize Redis notify suffixes in `lib/kernel/worker/notify.js` and post-ingest fan-out in `lib/kernel/worker/pipeline.js`; keep queue names in `lib/constants/statements.js` (already the durable source).
3. Add contract tests that lock exact string values so accidental renames fail CI.
4. Migrate worker handlers behind the strangler without changing subscribe/publish channel names or Bull queue names.
5. Prefer incremental handler modernization (persona extract → query builder → forwarding) after notify/queue wiring is covered by tests.

## Consequences

### Positive

- Dual-run against `ll-legacy` / `ll-modern` can share the same Redis/Mongo without remapping.
- Refactors cannot silently rename `STATEMENT_FORWARDING_REQEUST_QUEUE` or `statement.notify`.

### Negative

- Historical typos remain forever unless a coordinated dual-write migration is planned later.
- Worker TypeScript migration must keep JS interop for these string constants.
