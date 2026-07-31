# Native GET rollout findings

## Status

Stage 1 **live** on `ll-modern` under [ADR 0014](../adr/0014-native-get-rollout.md)
(`feat/lab-native-get-rollout`).

## Decision executed

| Host | Native GET flags | Read path |
|------|------------------|-----------|
| `ll-legacy` | all `false` | restify oracle |
| `ll-modern` | all `true` | native GET stranglers |

Code / base overlay defaults remain `false`. Modern persistence comes from
`lab/env/app.env.overlay.modern-native-get` via `STACK=modern` in `start-core.sh`.
Dual-run orchestrators keep modern flags on (`KEEP_MODERN_NATIVE_ON=1`).

## Verification (2026-07-31)

Synced branch to both VMs, rebuilt API on modern, compared:

- `NATIVE_GET_COMPARE_OK` — 20/20 status parity (client basic)
- `ORG_JWT_BODY_COMPARE_OK` — 20/20 canonical body parity (org JWT)

Modern flags left **on** after both runs.

## Next

1. Canary (stage 2) on a UI-serving modern host.
2. Default-on (stage 3) only after soak.
3. Statement remains restify-only.
