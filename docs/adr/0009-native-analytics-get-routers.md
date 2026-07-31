# ADR 0009: Feature-flag native analytics GET routers beside restify

## Status

Accepted

## Context

Inventory step 4 covers Dashboard, Visualisation, Query, Export, and Download. These share the same scoped GET pattern as earlier stranglers and use shareable/org scope filters already in `lib/services/auth`.

## Decision

1. Add a shared factory (`createScopedGetController` / `createScopedGetRouter`) for list + by-id GETs.
2. Gate each model with its own `ENABLE_NATIVE_*_ROUTER` flag (default `false`).
3. Mount before restify when enabled; writes remain on restify.
4. Centralize `$and` filter composition in `lib/kernel/api/scopedRead.js`.

## Consequences

### Positive

- Less duplication for the remaining restify GET migrations.
- Independent dual-run flags per model.

### Negative

- Five more temporary dual paths until writes are migrated.
