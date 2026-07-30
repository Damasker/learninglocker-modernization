# ADR 0013: Feature-flag native StatementForwarding / QueryBuilderCache GET routers

## Status

Accepted

## Context

Inventory remaining restify models after restricted GET stranglers (ADR 0011) are Statement, StatementForwarding, QueryBuilderCache, and QueryBuilderCacheValue. Statement stays on restify (create/update blocked; delete gated). Forwarding and query-builder cache models already have `getScopeFilter` mappings and are read-heavy UI/admin surfaces suitable for the same GET strangler pattern.

## Decision

1. Add native GET list/by-id routers gated by independent `ENABLE_NATIVE_*` flags (default `false`).
2. Reuse shared scoped-get factories from ADR 0009 and existing scope filters for `statementforwarding`, `querybuildercache`, and `querybuildercachevalue`.
3. Keep restify owning POST/PUT/PATCH/DELETE for these models.
4. Leave Statement on restify until separate dual-run work.

## Consequences

### Positive

- Completes non-Statement restify GET inventory coverage behind feature flags.
- Dual-run can compare restify vs native status/body for forwarding and cache lists.

### Negative

- Three more env flags to toggle in lab smoke; Statement remains the last restify-only CRUD surface.
