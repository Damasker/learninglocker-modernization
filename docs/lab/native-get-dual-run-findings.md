# Native GET dual-run findings

## Status

Pass on `feat/api-native-forwarding-cache-routers` ([PR #18](https://github.com/Damasker/learninglocker-modernization/pull/18)), stacked on the initial native GET dual-run in PR #17.

## Method

- `ll-legacy`: all `ENABLE_NATIVE_*_ROUTER=false` (restify GETs)
- `ll-modern`: all `ENABLE_NATIVE_*_ROUTER=true` (native GETs)
- Auth: lab golden client basic (`xapi/all`)
- Pass criterion: identical HTTP status per `/v2` list path

## Results (2026-07-30)

`NATIVE_GET_COMPARE_OK` — 20/20 paths matched.

| Path | Status (both) |
|------|----------------|
| `/v2/organisation` | 200 |
| `/v2/sitesettings` | 200 |
| `/v2/stream` | 200 |
| `/v2/client`, `/v2/lrs`, `/v2/role`, `/v2/user` | 403 |
| `/v2/dashboard`, `/v2/visualisation`, `/v2/query`, `/v2/export`, `/v2/download` | 403 |
| `/v2/personaattribute`, `/v2/personasimport`, `/v2/personasimporttemplate`, `/v2/importcsv` | 403 |
| `/v2/batchdelete` | 403 |
| `/v2/statementforwarding`, `/v2/querybuildercache`, `/v2/querybuildercachevalue` | 403 |

403s are expected for a client token without org/user scopes; parity of denial is the signal that native routers use the same `getScopeFilter` gates as restify.

## Organisation JWT body parity (2026-07-30)

`ORG_JWT_BODY_COMPARE_OK` — 20/20 paths returned HTTP 200 with identical
canonical response kind, item count, and SHA-256 body hash.

The run used a deterministic synthetic organisation-admin user and scoped
fixtures. Canonicalization removes volatile timestamps, password/reset data,
and transient auth fields before hashing. Client, LRS, Organisation, User,
QueryBuilderCache, QueryBuilderCacheValue, and SiteSettings had non-empty
matching responses; the remaining scoped lists matched as empty arrays.

The first diagnostic run exposed fixture-only differences:

- BatchDelete needed the explicit `statements/delete` scope (`all` does not imply it).
- User needed an `_id` request filter rather than the other models'
  `organisation` filter.
- QueryBuilderCache collections contained history from earlier golden runs and
  were replaced with deterministic fixtures.

After correcting the test contract, restify and native bodies matched.

## Next

1. ADR 0014 stage 1 (lab-only): keep `ll-modern` native GET flags **on**; `ll-legacy` stays restify.
2. Stage 2 canary on a UI-serving modern instance when ready.
3. Statement GET strangler (ADR 0015) — feature-flagged; writes stay on restify.
