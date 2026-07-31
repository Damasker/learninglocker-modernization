# Statement GET dual-run findings

## Status

Pass on `feat/api-native-statement-get-router` (ADR 0015).

## Results (2026-07-31)

- `NATIVE_GET_COMPARE_OK` — 21/21 paths (includes `/v2/statement` **200→200** under client basic)
- `ORG_JWT_BODY_COMPARE_OK` — 21/21 paths; Statement body match for synthetic fixture `_id=111111111111111111111111`

Smoke sends both `query` and `filter` so restify and native handlers apply the same selector. Canonical hash omits statement queue marker fields.

Create/update remain 405; delete remains restify-gated. Modern stage-1 flags stay on and now include `ENABLE_NATIVE_STATEMENT_ROUTER`.
