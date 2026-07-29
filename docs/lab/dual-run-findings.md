# Dual-run findings

## Status

Tooling on `feat/lab-dual-run-golden-path` ([PR #15](https://github.com/Damasker/learninglocker-modernization/pull/15)).

## Hosts

| Host | Role | Notes |
|------|------|-------|
| `ll-legacy` | infra oracle (Mongo **4.2** / Redis 4) | Node 20 + yarn + pm2 beside `ll-node10-exec`; **full golden path PASS** |
| `ll-modern` | migration target (Mongo **7** / Redis 7) | Core path PASS with `GOLDEN_REQUIRE_PERSONA=0` |

Native GET strangler flags remain **off**.

## Results (2026-07-29)

| Step | ll-legacy | ll-modern |
|------|-----------|-----------|
| API `/` smoke | PASS | PASS |
| xAPI store | PASS | PASS |
| Mongo envelope | PASS | PASS |
| Redis notify (`LEARNINGLOCKER:statement.notify`) | PASS | PASS |
| Query-builder cache queue | PASS | PASS |
| Persona extract queue | **PASS** | **BLOCKED** (OP_QUERY) |
| Aggregate / count | PASS | PASS |

### Persona blocker on Mongo 7

```text
MongoError: Unsupported OP_QUERY command: find.
The client driver may require an upgrade.
```

**Mitigation (ADR 0012):** kernel `createMongoClient` reuses the mongoose connection (mongodb driver 3.x) instead of persona-service's mongodb@2 connect. Re-test modern with `GOLDEN_REQUIRE_PERSONA=1` after deploying `fix/persona-mongo7-driver`.

### Lab hardening landed

- Await `personaService.migrate()`; `ensure-persona-collections.sh`
- `wrapStatementJob` logs handler errors
- `mongosh` → `mongo` fallback for Mongo 4.2
- ObjectId string formatting tolerated across shells

## Next

1. Upgrade/patch persona-service mongo client for Mongo 7.
2. Re-run modern with `GOLDEN_REQUIRE_PERSONA=1` after the driver fix.
3. Optional: flag-on native GET dual-run.
