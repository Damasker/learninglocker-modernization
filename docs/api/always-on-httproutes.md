# Always-on HttpRoutes (outside restify inventory)

Surfaces mounted unconditionally in `api/src/routes/HttpRoutes.js` (and
dedicated persona routers). **No** `ENABLE_NATIVE_*` gate. Restify `/v2` models
are tracked in `docs/api/restify-v2-inventory.md`.

## Health / auth

| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | Liveness `OK` |
| GET | `/app/version` | Git short SHA payload |
| POST | `/auth/jwt/password`, `/auth/jwt/organisation`, … | Passport JWT minting |
| GET/POST | OAuth / Google / reset-password helpers | Site auth |

## Persona dedicated (ADR 0021)

| Method | Path | Notes |
|--------|------|-------|
| * | `/v2/persona`, `/v2/personaIdentifier`, connections | `personaRESTHandler` / `personaIdentifierRESTHandler` |
| POST | `/mergepersona` | On persona router; mutates personas |

## Uploads / imports

| Method | Path | Notes |
|--------|------|-------|
| POST | `/uploadlogo` | Org logo binary |
| POST | `/uploadpersonas`, `/importpersonas`, `/uploadpersona` | Persona CSV/JSON import |
| GET | `/organisation/:organisationId/importpersonaserror/:id.csv` | Import error download |

## Downloads / export helpers

| Method | Path | Notes |
|--------|------|-------|
| GET | `/downloadlogo/:org` | Logo stream |
| GET | `/organisation/:organisationId/downloadexport/:download.csv` | Export file stream |
| GET | `/export` | ExportController download helper (distinct from `/v2/export`) |

## Statement metadata

| Method | Path | Notes |
|--------|------|-------|
| POST/PATCH | `/v2/statementmetadata/:id` | Mutates `statements.metadata`; refreshes query-builder cache |

## User organisation helpers

| Method | Path | Notes |
|--------|------|-------|
| DELETE | `/v2/users/:userId/organisations/:organisationId` | `UserOrganisationsRouter` |
| POST/PATCH/DELETE | `/v2/users/:userId/organisationSettings/:organisationId` | `UserOrganisationSettingsRouter` |

## Gated elsewhere (not always-on when native flag on)

Statement analytics, BatchDelete specialised POSTs, and restify
connection/indexes fall under ADR 0018–0020 flags. When those flags are **off**,
HttpRoutes still mounts the legacy always-on fallbacks.

## Lab verification

`lab/scripts/native-always-on-httproutes-smoke.sh` +
`lab/scripts/dual-run-native-always-on-httproutes.sh` (ADR 0022).
