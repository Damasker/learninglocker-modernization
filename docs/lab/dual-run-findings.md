# Dual-run findings

## Status

Tooling on `feat/lab-dual-run-golden-path` ([PR #15](https://github.com/Damasker/learninglocker-modernization/pull/15)).

## Hosts

| Host | Role | Notes |
|------|------|-------|
| `ll-legacy` | infra oracle (Mongo 4.2 / Redis 4) | Node 20 + yarn + pm2 installed alongside `ll-node10-exec`; app tip build pending full golden pass |
| `ll-modern` | migration target (Mongo 7 / Redis 7) | Core services up; first golden pass executed |

Native GET strangler flags remain **off**.

## ll-modern golden path (2026-07-29)

| Step | Result |
|------|--------|
| API `/` smoke | PASS (HTTP 200) |
| xAPI store statement | PASS (HTTP 200) |
| Mongo envelope (`organisation`, `lrs_id`, `hash`) | PASS |
| Redis notify contract (`REDIS_PREFIX:statement.notify`) | PASS (`LEARNINGLOCKER:statement.notify`) |
| Query-builder cache queue complete | PASS |
| Persona extract queue complete | **FAIL** — stays in `processingQueues`; `personas`/`personaIdentifiers` stay empty; Bull logs `JOB N FAILED No queue` after handler callback |
| Aggregate / count | PASS (HTTP 200) |

### Persona follow-ups

1. `personaService.migrate()` in `20171008104700_personas_indexes` was not awaited (fixed in this branch); lab helper `ensure-persona-collections.sh` creates collections.
2. Even with collections present, extract still fails silently; `wrapStatementJob` now logs handler errors.
3. Redis notify channel uses colon separator via `cachePrefix` (`PREFIX:suffix`), matching worker subscribe logs.

## Next

1. Capture the logged persona handler error after worker rebuild on both hosts.
2. Finish legacy `STACK=modern` host-runtime golden pass (same app tip; infra differential).
3. Optional: flag-on native GET dual-run after persona path is green.
