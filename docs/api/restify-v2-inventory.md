# Restify `/v2` inventory (strangler map)

Source of truth for model list: `lib/kernel/api/restifyModels.js`.

## Mount conventions

- CRUD: `express-restify-mongoose` under `RESTIFY_PREFIX` (`/v2`)
- Connection helpers: `GET /connection/:modelNameLower`
- Index helpers: `GET /indexes/:modelNameLower`
- Auth for connection/indexes: Passport `jwt` + `clientBasic`

## Persona exception

Persona and PersonaIdentifier CRUD are **not** restify-mounted; they use dedicated routers under `api/src/routes/personas/`.

## Client GET strangler

When `ENABLE_NATIVE_CLIENT_ROUTER=true`, native handlers serve:

- `GET /v2/client`
- `GET /v2/client/:id`

using `lib/kernel/auth` `getScopeFilter` + `lib/kernel/api/client` filter helpers. Restify continues to own POST/PUT/PATCH/DELETE for Client. Default flag is **off**.

## LRS GET strangler

When `ENABLE_NATIVE_LRS_ROUTER=true`, native handlers serve:

- `GET /v2/lrs`
- `GET /v2/lrs/:id`

using `lib/kernel/auth` `getScopeFilter` + `lib/kernel/api/lrs` filter helpers. Restify continues to own writes. Default flag is **off**.

## Organisation GET strangler

When `ENABLE_NATIVE_ORGANISATION_ROUTER=true`, native handlers serve:

- `GET /v2/organisation`
- `GET /v2/organisation/:id`

using organisation-specific scope filters (`_id: { $in: viewableOrgs }` / site admin `{}`). Restify continues to own writes (including expiration `preUpdate`). Default flag is **off**.

## Role / User GET stranglers

When `ENABLE_NATIVE_ROLE_ROUTER=true`:

- `GET /v2/role`, `GET /v2/role/:id`

When `ENABLE_NATIVE_USER_ROUTER=true`:

- `GET /v2/user`, `GET /v2/user/:id` (applies `getScopeSelect` / MANAGER vs limited select)

Writes remain on restify. Defaults **off**.

## Analytics GET stranglers

Independent flags (default **off**):

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_DASHBOARD_ROUTER` | `/v2/dashboard`, `/v2/dashboard/:id` |
| `ENABLE_NATIVE_VISUALISATION_ROUTER` | `/v2/visualisation`, `/v2/visualisation/:id` |
| `ENABLE_NATIVE_QUERY_ROUTER` | `/v2/query`, `/v2/query/:id` |
| `ENABLE_NATIVE_EXPORT_ROUTER` | `/v2/export`, `/v2/export/:id` |
| `ENABLE_NATIVE_DOWNLOAD_ROUTER` | `/v2/download`, `/v2/download/:id` |

Shared factories: `createScopedGetController` / `createScopedGetRouter`. Writes remain on restify.

## Persona-import GET stranglers

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER` | `/v2/personaattribute`, `/v2/personaattribute/:id` |
| `ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER` | `/v2/personasimport`, `/v2/personasimport/:id` |
| `ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER` | `/v2/personasimporttemplate`, `/v2/personasimporttemplate/:id` |
| `ENABLE_NATIVE_IMPORT_CSV_ROUTER` | `/v2/importcsv`, `/v2/importcsv/:id` |

Also maps `personasimporttemplate` into persona `getScopeFilter` (was missing). Defaults **off**.

## Restricted GET stranglers

| Flag | Paths | Notes |
|------|-------|-------|
| `ENABLE_NATIVE_SITE_SETTINGS_ROUTER` | `/v2/sitesettings`, `/v2/sitesettings/:id` | Scope filter `{}` (historical) |
| `ENABLE_NATIVE_STREAM_ROUTER` | `/v2/stream`, `/v2/stream/:id` | Org scope; fixes missing `stream` mapping |
| `ENABLE_NATIVE_BATCH_DELETE_ROUTER` | `/v2/batchdelete`, `/v2/batchdelete/:id` | Writes stay 405 / specialised POSTs |

Defaults **off**. Completes inventory step 6.

## Forwarding / cache GET stranglers

| Flag | Paths |
|------|-------|
| `ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER` | `/v2/statementforwarding`, `/v2/statementforwarding/:id` |
| `ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER` | `/v2/querybuildercache`, `/v2/querybuildercache/:id` |
| `ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER` | `/v2/querybuildercachevalue`, `/v2/querybuildercachevalue/:id` |

Shared factories: `createScopedGetController` / `createScopedGetRouter`. Writes remain on restify. Defaults **off**. Completes inventory step 7 (non-Statement).

## Replacement order (proposed)

1. Keep Statement restify read + scoped delete behavior; never open create/update via `/v2`
2. Client / LRS / Organisation (auth-adjacent) — GET stranglers landed (feature-flagged)
3. Role / User — GET stranglers landed (feature-flagged)
4. Dashboard / Visualisation / Query / Export / Download — GET stranglers landed (feature-flagged)
5. PersonaAttribute / PersonasImport* — GET stranglers landed (feature-flagged)
6. SiteSettings / Stream / BatchDelete — GET stranglers landed (feature-flagged)
7. StatementForwarding / QueryBuilderCache* — GET stranglers landed (feature-flagged)

Remaining restify-only CRUD surface: Statement (create/update blocked; delete gated).

Do not flip traffic to a replacement router without dual-run parity of scope filters from `lib/kernel/auth`.
