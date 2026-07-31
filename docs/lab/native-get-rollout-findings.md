# Native GET rollout findings

## Status

Stages 1–3 **live** in lab under
[ADR 0014](../adr/0014-native-get-rollout.md). Native writes follow
[ADR 0016](../adr/0016-native-v2-writes.md) / [ADR 0017](../adr/0017-native-statement-batchdelete-writes.md).

## Decision executed

| Host | Native flags | Path |
|------|--------------|------|
| `ll-legacy` | all `false` via `app.env.overlay.legacy-restify` | restify oracle |
| `ll-modern` | all `true` via base overlay + `modern-native-get` | native GET + write + UI canary |

Code / `.env.example` defaults remain `false`. Lab base
`lab/env/app.env.overlay` is stage-3 default-on. `start-core.sh` / `start-ui.sh`
pin modern vs legacy via stack overlays (`STACK` or hostname).

## Verification (2026-07-31)

Stage 1:

- `NATIVE_GET_COMPARE_OK` — 20/20 status parity (client basic)
- `ORG_JWT_BODY_COMPARE_OK` — 20/20 canonical body parity (org JWT)

Stage 2 / writes:

- `NATIVE_WRITE_SMOKE_OK` — dashboard **201 / 200 / 204** (both hosts)
- UI canary on modern: `UI HTTP 200`, `/api` proxy `HTTP 200`
- `NATIVE_USER_WRITE_SMOKE_OK` — user **201 / 200 / 204** (both hosts)
- `NATIVE_STATEMENT_WRITE_SMOKE_OK` — statement create/put **403**, delete **204**;
  batchdelete CUD **405**; specialised POSTs initialise **200**, terminate **204**,
  empty filter **400** (both hosts; ADR 0018)

Stage 3:

- Sync + `start-core.sh` on both hosts (2026-07-31): `ll-modern` → 21×`true`;
  `ll-legacy` → 21×`false` via `app.env.overlay.legacy-restify`.
  (Flag count is now **22** with ADR 0019 aggregate router.)

ADR 0019 analytics:

- `NATIVE_STATEMENT_AGGREGATE_COMPARE_OK` — aggregate / async / count / v1 all
  **200** with matching kind/count/body hash (golden `statement.id` filter)

ADR 0020 connection/indexes:

- `NATIVE_CONNECTION_INDEXES_COMPARE_OK` — status parity on connection + indexes
  for organisation/lrs/client/statement/querybuildercache; indexes body hashes
  match; connection accepts 200/403 (client-basic scope)

ADR 0021 Persona / PersonaIdentifier (always-on native):

- `NATIVE_PERSONA_COMPARE_OK` — both hosts **200** on list/by-id/count/connection
  for persona + personaIdentifier; golden by-id body hashes match. List/count
  volumes may differ across independent lab Mongo DBs (compare requires status +
  kind; by-id requires hash). Fixture fix: seed `persona` (not `personaId`) so
  persona-service `document.persona.toString()` does not crash.

## Next

1. Keep soaking canary UI on `ll-modern`.
2. Non-lab deploys remain opt-in (code defaults `false`).
3. Remaining always-on HttpRoutes outside the restify inventory (uploads, statement
   metadata, mergepersona) stay documented separately; no further GET strangler
   flags on the inventory map.
