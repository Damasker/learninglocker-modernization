# ADR 0020: Native connection and indexes GET routers behind a feature flag

## Status

Accepted

## Context

After ADR 0019, the restify inventory map’s remaining always-on helpers were:

- `GET /connection/:modelNameLower`
- `GET /indexes/:modelNameLower`

Generated in `HttpRoutes.js` for every `RESTIFY_V2_MODELS` entry with
`connections: true` (19 models). Controllers
(`generateConnectionController` / `generateIndexesController`) already own
behavior; only mount ownership needed to move under the strangler flag family.

## Decision

1. Add `ENABLE_NATIVE_CONNECTION_INDEXES_ROUTER` (code default **off**).
2. When **true**, mount both connection and indexes GETs on
   `api/src/routes/connectionIndexes/router.js` with the same custom Passport
   callback (**401** `text/plain` Unauthorized) and the same controllers.
3. When **false**, keep the existing `HttpRoutes` generation loop as fallback.
4. One flag owns both surfaces (they are co-generated today).
5. Lab overlays: modern **on**, legacy-restify **off**. Do not change
   connection/index response shapes or scope filters.

## Consequences

### Positive

- UI pagination helpers (`/connection/*`) and index metadata follow the same
  flag-on ownership rule as `/v2` and analytics stranglers.
- Remount-only; controllers unchanged.

### Negative

- Persona/PersonaIdentifier connection paths remain on their dedicated routers.
- Flag-off path still duplicates the model loop in `HttpRoutes` until restify
  fallback is removed in a later cleanup.
