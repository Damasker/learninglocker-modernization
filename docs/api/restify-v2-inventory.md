# Restify `/v2` inventory (strangler map)

Source of truth for model list: `lib/kernel/api/restifyModels.js`.

## Mount conventions

- CRUD: `express-restify-mongoose` under `RESTIFY_PREFIX` (`/v2`)
- Connection helpers: `GET /connection/:modelNameLower`
- Index helpers: `GET /indexes/:modelNameLower`
- Auth for connection/indexes: Passport `jwt` + `clientBasic`

## Persona exception

Persona and PersonaIdentifier CRUD are **not** restify-mounted; they use dedicated
routers under `api/src/routes/personas/` and are **always-on native** (ADR 0021).
No `ENABLE_NATIVE_*` gate — there is no restify fallback.

## Client

When `ENABLE_NATIVE_CLIENT_ROUTER=true`, native handlers serve full CRUD on
`/v2/client` (ADR 0016). Default flag is **off**.

## LRS

When `ENABLE_NATIVE_LRS_ROUTER=true`, native handlers serve full CRUD on
`/v2/lrs`. Default flag is **off**.

## Organisation

When `ENABLE_NATIVE_ORGANISATION_ROUTER=true`, native handlers serve full CRUD
on `/v2/organisation` (expiration remains site-admin-only on update). Default
flag is **off**.

## Role / User

When `ENABLE_NATIVE_ROLE_ROUTER=true`: Role full CRUD on `/v2/role`.

When `ENABLE_NATIVE_USER_ROUTER=true`: User full CRUD on `/v2/user`
(organisations `checkOrg` parity on create; field picks; `MANAGER_SELECT`
response). Defaults **off**.

## Analytics

Independent flags (default **off**). When on, each flag owns full CRUD via
`createScopedCrudController` / `createScopedGetRouter`:

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_DASHBOARD_ROUTER` | `/v2/dashboard` |
| `ENABLE_NATIVE_VISUALISATION_ROUTER` | `/v2/visualisation` |
| `ENABLE_NATIVE_QUERY_ROUTER` | `/v2/query` |
| `ENABLE_NATIVE_EXPORT_ROUTER` | `/v2/export` |
| `ENABLE_NATIVE_DOWNLOAD_ROUTER` | `/v2/download` |

## Persona-import

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER` | `/v2/personaattribute` CRUD |
| `ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER` | `/v2/personasimport` CRUD |
| `ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER` | `/v2/personasimporttemplate` CRUD |
| `ENABLE_NATIVE_IMPORT_CSV_ROUTER` | `/v2/importcsv` CRUD |

Defaults **off**.

## Restricted

| Flag | Paths | Notes |
|------|-------|-------|
| `ENABLE_NATIVE_SITE_SETTINGS_ROUTER` | `/v2/sitesettings` CRUD | Scope filter `{}` |
| `ENABLE_NATIVE_STREAM_ROUTER` | `/v2/stream` CRUD | Org scope |
| `ENABLE_NATIVE_BATCH_DELETE_ROUTER` | `/v2/batchdelete` GET + CUD **405** + specialised POSTs | initialise / terminate / terminate-all (ADR 0018) |

Defaults **off**.

## Forwarding / cache

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER` | `/v2/statementforwarding` CRUD |
| `ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER` | `/v2/querybuildercache` CRUD |
| `ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER` | `/v2/querybuildercachevalue` CRUD |

Defaults **off**.

## Statement

When `ENABLE_NATIVE_STATEMENT_ROUTER=true`, native handlers serve GET list/by-id
plus write verbs (ADR 0017):

- POST/PUT/PATCH → **405**
- DELETE `/:id` → gated by `ENABLE_STATEMENT_DELETION` + `statements/delete` scope

Default flag is **off**.

## Statement analytics (ADR 0019)

When `ENABLE_NATIVE_STATEMENT_AGGREGATE_ROUTER=true`, native handlers serve:

- `GET /statements/aggregate`
- `GET /statements/aggregateAsync`
- `GET /statements/count`
- `GET /v1/statements/aggregate`

Same `StatementController` handlers as the HttpRoutes fallback. Default **off**.

## Native writes (ADR 0016 / 0017)

Same `ENABLE_NATIVE_*_ROUTER` flags mount POST/PUT/PATCH/DELETE beside GET for
all restify models. Statement keeps 405 / gated delete (ADR 0017). BatchDelete
keeps CUD 405 plus specialised POSTs under the same flag (ADR 0018).

## Remaining restify-owned specials

None for the inventory map in this doc. Persona / PersonaIdentifier are
always-on dedicated natives (ADR 0021).

When `ENABLE_NATIVE_CONNECTION_INDEXES_ROUTER=true` (ADR 0020), native handlers
serve `GET /connection/:model` and `GET /indexes/:model` for models with
`connections: true` in `restifyModels.js`. Persona connection helpers remain on
the dedicated persona routers (`/connection/persona`, `/connection/personaidentifier`).

Do not flip traffic without dual-run parity of scope filters from `lib/kernel/auth`.
