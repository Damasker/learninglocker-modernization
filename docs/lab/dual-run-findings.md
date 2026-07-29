# Dual-run findings

## Status

Tooling on `feat/lab-dual-run-golden-path` ([PR #15](https://github.com/Damasker/learninglocker-modernization/pull/15)).

## Hosts

| Host | Role | Notes |
|------|------|-------|
| `ll-legacy` | infra oracle (Mongo **4.2** / Redis 4) | Node 20 + yarn + pm2 installed beside `ll-node10-exec` |
| `ll-modern` | migration target (Mongo **7** / Redis 7) | API + Worker + xAPI online |

Native GET strangler flags remain **off**.

## ll-modern golden path (2026-07-29)

| Step | Result |
|------|--------|
| API `/` smoke | PASS (HTTP 200) |
| xAPI store statement | PASS (HTTP 200) |
| Mongo envelope (`organisation`, `lrs_id`, `hash`) | PASS |
| Redis notify (`LEARNINGLOCKER:statement.notify`) | PASS |
| Query-builder cache queue complete | PASS |
| Persona extract queue complete | **BLOCKED** |
| Aggregate / count | PASS (HTTP 200) |

### Persona blocker (Mongo 7)

Worker error:

```text
MongoError: Unsupported OP_QUERY command: find.
The client driver may require an upgrade.
```

`@learninglocker/persona-service` still uses a MongoDB Node driver that speaks the legacy OP_QUERY opcode. MongoDB **5.1+** (including lab Mongo **7** on `ll-modern`) removed OP_QUERY, so persona extract cannot write `personas` / `personaIdentifiers`.

Mitigations (pick one for a later PR):

1. Upgrade/patch persona-service (or its mongo client) to a driver that uses the modern find command.
2. Keep dual-run persona assertions on `ll-legacy` (Mongo 4.2) until (1) lands.
3. Lab-only: set `GOLDEN_REQUIRE_PERSONA=0` on Mongo 7 hosts.

Also fixed: `personaService.migrate()` was not awaited in `20171008104700_personas_indexes`; lab helper `ensure-persona-collections.sh` creates collections; `wrapStatementJob` logs handler errors.

## Next

1. Finish golden path on `ll-legacy` (expect persona PASS on Mongo 4.2).
2. Plan persona-service mongo driver upgrade for Mongo 7 parity.
3. Optional flag-on native GET dual-run after persona path is green on modern.
