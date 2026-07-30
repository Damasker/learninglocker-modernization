# Native GET dual-run findings

## Status

Pass on `feat/lab-native-get-dual-run` ([PR #17](https://github.com/Damasker/learninglocker-modernization/pull/17)), stacked on persona Mongo 7 fix.

## Method

- `ll-legacy`: all `ENABLE_NATIVE_*_ROUTER=false` (restify GETs)
- `ll-modern`: all `ENABLE_NATIVE_*_ROUTER=true` (native GETs)
- Auth: lab golden client basic (`xapi/all`)
- Pass criterion: identical HTTP status per `/v2` list path

## Results (2026-07-30)

`NATIVE_GET_COMPARE_OK` — 17/17 paths matched.

| Path | Status (both) |
|------|----------------|
| `/v2/organisation` | 200 |
| `/v2/sitesettings` | 200 |
| `/v2/stream` | 200 |
| `/v2/client`, `/v2/lrs`, `/v2/role`, `/v2/user` | 403 |
| `/v2/dashboard`, `/v2/visualisation`, `/v2/query`, `/v2/export`, `/v2/download` | 403 |
| `/v2/personaattribute`, `/v2/personasimport`, `/v2/personasimporttemplate`, `/v2/importcsv` | 403 |
| `/v2/batchdelete` | 403 |

403s are expected for a client token without org/user scopes; parity of denial is the signal that native routers use the same `getScopeFilter` gates as restify.

## Next

1. Optional JWT/org-token smoke for 200 bodies on scoped models (deeper payload parity).
2. UI decision / remaining restify models (StatementForwarding, QueryBuilderCache*).
