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
  batchdelete CUD **403** (both hosts; scope-then-405 parity)

Stage 3:

- Base overlay default-on; legacy-restify overlay keeps dual-run oracle off
  (verify after sync: modern flags `true`, legacy flags `false`).

## Next

1. Keep soaking canary UI on `ll-modern`.
2. Non-lab deploys remain opt-in (code defaults `false`).
