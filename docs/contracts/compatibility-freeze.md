# Compatibility freeze (lab baseline)

Do not change these contracts without dual-run parity between `ll-legacy` and `ll-modern`.

## Mongo collections / shape

Primary models under `lib/models/`:

- `statements` — nested `statement`, `organisation`, `lrs_id`, `client`, persona fields, queue markers, forwarding state, `hash`, `metadata`
- `lrs`, `client`, `organisation`, `user`, `role`
- persona-related collections via `@learninglocker/persona-service`
- `querybuildercache`, `querybuildercachevalue`, `statementForwarding`, `export`, `download`, `batchDelete`

Indexes from historical v2 migrations remain authoritative, especially:

- unique `{organisation, lrs_id, hash}`
- timestamp/stored cursor indexes
- actor/verb/object and persona identifier paths

## Redis

- Prefix: `REDIS_PREFIX` (lab default `LEARNINGLOCKER`)
- Statement notify channel suffix: `statement.notify` (via `cachePrefix`, see `lib/kernel/worker/notify.js`)
- Statement work list suffix: `statement.new` (RPOP after notify)
- Aggregation cache keys and TTLs from `.env.example`

## Queues

Names in `lib/constants/statements.js` are durable contracts, including historical typos.

Required for core post-ingest path:

- `STATEMENT_QUEUE`
- `STATEMENT_PERSON_QUEUE` (`STATEMENT_EXTRACT_PERSONAS_QUEUE`)
- `STATEMENT_QUERYBUILDERCACHE_QUEUE`
- forwarding queues when enabled

## Auth / API

- Passport strategies and JWT shapes in `api/src/auth/`
- Scope filters and authInfo selectors via `lib/kernel/auth` (implementations in `lib/services/auth/`)
- Durable scope strings frozen in `lib/kernel/auth` contract tests (`site_admin`, `xapi/*`, `statements/*`)
- `/v2` REST surface and statement aggregate/count routes in `api/src/routes/HttpRoutes.js`
- Statement analytics paths: `/statements/aggregate`, `/statements/aggregateAsync`, `/statements/count`, `/v1/statements/aggregate` (frozen in `lib/kernel/api/routes.js`)
- Restify `/v2` model inventory: `lib/kernel/api/restifyModels.js` + `docs/api/restify-v2-inventory.md`
- Optional native Client GET router behind `ENABLE_NATIVE_CLIENT_ROUTER` (`api/src/routes/clients/router.js`)
- Optional native LRS GET router behind `ENABLE_NATIVE_LRS_ROUTER` (`api/src/routes/lrs/router.js`)
- Optional native Organisation GET router behind `ENABLE_NATIVE_ORGANISATION_ROUTER` (`api/src/routes/organisations/router.js`)
- Optional native Role GET router behind `ENABLE_NATIVE_ROLE_ROUTER` (`api/src/routes/roles/router.js`)
- Optional native User GET router behind `ENABLE_NATIVE_USER_ROUTER` (`api/src/routes/users/router.js`)
- Optional analytics GET routers: `ENABLE_NATIVE_DASHBOARD_ROUTER`, `ENABLE_NATIVE_VISUALISATION_ROUTER`, `ENABLE_NATIVE_QUERY_ROUTER`, `ENABLE_NATIVE_EXPORT_ROUTER`, `ENABLE_NATIVE_DOWNLOAD_ROUTER`
- Optional persona-import GET routers: `ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER`, `ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER`, `ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER`, `ENABLE_NATIVE_IMPORT_CSV_ROUTER`
- Optional restricted GET routers: `ENABLE_NATIVE_SITE_SETTINGS_ROUTER`, `ENABLE_NATIVE_STREAM_ROUTER`, `ENABLE_NATIVE_BATCH_DELETE_ROUTER`
- Optional forwarding/cache GET routers: `ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER`, `ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER`, `ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER`
- Optional Statement GET router: `ENABLE_NATIVE_STATEMENT_ROUTER` (create/update stay 405; delete stays restify-gated)
- Optional statement analytics router: `ENABLE_NATIVE_STATEMENT_AGGREGATE_ROUTER` (`/statements/aggregate*`, `/statements/count`, `/v1/statements/aggregate`)
- Optional connection/indexes router: `ENABLE_NATIVE_CONNECTION_INDEXES_ROUTER` (`/connection/:model`, `/indexes/:model`)
- Always-on Persona / PersonaIdentifier dedicated routers (ADR 0021; no gate flag)
- Native GET rollout is staged (ADR 0014): lab `ll-modern` may run with all flags `true` while code defaults stay `false`

## Persona Mongo access

- Persona-service DB handle is provided by `lib/kernel/persona/createMongoClient.js` (mongoose native `Db`), not mongodb@2 `MongoClient.connect`, so MongoDB 5.1+ / 7 reject OP_QUERY is avoided.

## xAPI peer

- HTTP xAPI is served by `xapi-service`, not this app process
- Shared Mongo DB name and Redis must match Learning Locker
- Lab uses Express port `8081` for xAPI, `8080` for LL API, `3000` for UI

## Golden path

1. Authenticated client stores a statement through xAPI
2. Document appears in Mongo with expected envelope fields
3. Redis notify triggers worker
4. Persona extract and query-builder cache complete
5. Aggregate/count APIs return scoped results

Lab automation: `docs/lab/dual-run.md` (`lab/scripts/golden-path.sh`, `dual-run-golden.sh`).
