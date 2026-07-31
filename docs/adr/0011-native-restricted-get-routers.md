# ADR 0011: Feature-flag native restricted GET routers (SiteSettings / Stream / BatchDelete)

## Status

Accepted

## Context

Inventory step 6 covers SiteSettings, Stream, and BatchDelete — read-heavy or mutation-restricted restify surfaces. Stream was missing from `getScopeFilter`, so restify GETs threw `Invalid scope`. BatchDelete already blocks create/update/delete on restify (405); mutations go through dedicated initialise/terminate controllers.

## Decision

1. Map `stream` to an org scope filter (`getOrgFilter`) matching `filterByOrg` on the model.
2. Add native GET list/by-id routers gated by independent `ENABLE_NATIVE_*` flags (default `false`).
3. Keep BatchDelete write blocks and specialised POST controllers unchanged.
4. Reuse shared scoped-get factories from ADR 0009.

## Consequences

### Positive

- Completes the proposed restify GET inventory order for dual-run.
- Fixes Stream scope mapping for both restify and native paths.

### Negative

- SiteSettings scope remains open (`{}`) as historically; auth is passport-only.
