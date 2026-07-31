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

## Replacement order (proposed)

1. Keep Statement restify read + scoped delete behavior; never open create/update via `/v2`
2. Client / LRS / Organisation (auth-adjacent) — GET stranglers landed (feature-flagged)
3. Role / User — GET stranglers landed (feature-flagged)
4. Dashboard / Visualisation / Query / Export / Download — GET stranglers landed (feature-flagged)
5. PersonaAttribute / PersonasImport*
6. SiteSettings / Stream / BatchDelete read-only surfaces

Do not flip traffic to a replacement router without dual-run parity of scope filters from `lib/kernel/auth`.
