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

## Replacement order (proposed)

1. Keep Statement restify read + scoped delete behavior; never open create/update via `/v2`
2. Client / LRS / Organisation (auth-adjacent)
3. Role / User
4. Dashboard / Visualisation / Query / Export / Download
5. PersonaAttribute / PersonasImport*
6. SiteSettings / Stream / BatchDelete read-only surfaces

Do not flip traffic to a replacement router without dual-run parity of scope filters from `lib/kernel/auth`.
