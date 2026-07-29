# Dual-run findings

## Status

Tooling on `feat/lab-dual-run-golden-path` ([PR #15](https://github.com/Damasker/learninglocker-modernization/pull/15)).  
Persona Mongo 7 fix on `fix/persona-mongo7-driver` ([PR #16](https://github.com/Damasker/learninglocker-modernization/pull/16)).

## Hosts

| Host | Role | Notes |
|------|------|-------|
| `ll-legacy` | infra oracle (Mongo **4.2** / Redis 4) | Full golden path PASS |
| `ll-modern` | migration target (Mongo **7** / Redis 7) | Full golden path PASS after ADR 0012 |

Native GET strangler flags remain **off**.

## Results (2026-07-29)

| Step | ll-legacy | ll-modern |
|------|-----------|-----------|
| API `/` smoke | PASS | PASS |
| xAPI store | PASS | PASS |
| Mongo envelope | PASS | PASS |
| Redis notify (`LEARNINGLOCKER:statement.notify`) | PASS | PASS |
| Query-builder cache queue | PASS | PASS |
| Persona extract queue | PASS | **PASS** (after mongoose-backed client) |
| Aggregate / count | PASS | PASS |

### Persona / Mongo 7

Root cause was persona-service `mongodb@2` OP_QUERY. ADR 0012 wires persona `Db` through mongoose. Verified on modern with `GOLDEN_REQUIRE_PERSONA=1`.

## Next

1. Optional: flag-on native GET dual-run.
2. UI decision / further inventory (StatementForwarding, QueryBuilderCache*).
