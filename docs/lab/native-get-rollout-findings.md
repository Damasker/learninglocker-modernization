# Native GET rollout findings

## Status

Stage 1 accepted under [ADR 0014](../adr/0014-native-get-rollout.md) on
`feat/lab-native-get-rollout`.

## Decision executed

| Host | Native GET flags | Read path |
|------|------------------|-----------|
| `ll-legacy` | all `false` | restify oracle |
| `ll-modern` | all `true` | native GET stranglers |

Code / base overlay defaults remain `false`. Modern persistence comes from
`lab/env/app.env.overlay.modern-native-get` via `STACK=modern` in `start-core.sh`.

## Verification (pending first post-merge run)

Re-run after syncing this branch / `master`:

```bash
BRANCH=feat/lab-native-get-rollout bash lab/scripts/dual-run-native-get.sh
BRANCH=feat/lab-native-get-rollout bash lab/scripts/dual-run-org-jwt-get.sh
```

Expect `NATIVE_GET_COMPARE_OK` and `ORG_JWT_BODY_COMPARE_OK`, with modern flags
left on afterward.

## Next

1. Canary (stage 2) on a UI-serving modern host.
2. Default-on (stage 3) only after soak.
3. Statement remains restify-only.
