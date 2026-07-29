# ADR 0010: Feature-flag native persona-import GET routers beside restify

## Status

Accepted

## Context

Inventory step 5 covers PersonaAttribute, PersonasImport, PersonasImportTemplate, and ImportCsv. These share the persona org scope filter. `PersonasImportTemplate` was missing from `getScopeFilter`, so restify/native reads could throw `Invalid scope`.

## Decision

1. Map `personasimporttemplate` to the persona scope filter (same as PersonasImport / ImportCsv).
2. Add native GET list/by-id routers gated by independent `ENABLE_NATIVE_*` flags (default `false`).
3. Reuse shared scoped-get factories from ADR 0009.
4. Keep writes on restify.

## Consequences

### Positive

- Completes inventory step 5 for dual-run.
- Fixes missing scope mapping for PersonasImportTemplate.

### Negative

- PersonaAttribute also has legacy custom path param `:personaAttributeId`; native GET uses restify-style `:id`.
