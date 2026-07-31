# Native GET rollout findings

## Status

Stage 1 **live** and stage 2 **canary UI** on `ll-modern` under
[ADR 0014](../adr/0014-native-get-rollout.md). Native writes follow
[ADR 0016](../adr/0016-native-v2-writes.md).

## Decision executed

| Host | Native flags | Path |
|------|--------------|------|
| `ll-legacy` | all `false` | restify oracle |
| `ll-modern` | all `true` | native GET + write stranglers + UI canary |

Code / base overlay defaults remain `false`. Modern persistence comes from
`lab/env/app.env.overlay.modern-native-get` via `STACK=modern` in `start-core.sh`.
UI: `lab/scripts/build-ui.sh` + `lab/scripts/start-ui.sh` (`pm2/ui.json`).

## Verification (2026-07-31)

Stage 1:

- `NATIVE_GET_COMPARE_OK` — 20/20 status parity (client basic)
- `ORG_JWT_BODY_COMPARE_OK` — 20/20 canonical body parity (org JWT)

Stage 2 / writes: see verification notes after lab run on this branch.

## Next

1. Soak canary UI on `ll-modern`.
2. Default-on (stage 3) only after soak.
3. User / Statement / BatchDelete write stranglers (follow-up).
