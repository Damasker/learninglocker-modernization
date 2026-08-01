# Compat audit — NEW path prefixes

Files under these prefixes are **modernization-new**. They do **not** require
an inline `@ll-compat-audit` marker (plan 1A).

Maintained for `lab/scripts/compat-audit-gap.js`.

## Prefixes

```
docs/adr/
docs/lab/
docs/api/
docs/contracts/
lab/
lib/kernel/
api/src/routes/batchDeletes/
api/src/routes/clients/
api/src/routes/connectionIndexes/
api/src/routes/dashboards/
api/src/routes/downloads/
api/src/routes/exports/
api/src/routes/importCsv/
api/src/routes/lrs/
api/src/routes/organisations/
api/src/routes/personaAttributes/
api/src/routes/personasImports/
api/src/routes/personasImportTemplates/
api/src/routes/queries/
api/src/routes/queryBuilderCaches/
api/src/routes/queryBuilderCacheValues/
api/src/routes/roles/
api/src/routes/siteSettings/
api/src/routes/statementAnalytics/
api/src/routes/statementForwardings/
api/src/routes/statements/
api/src/routes/streams/
api/src/routes/users/
api/src/routes/visualisations/
api/src/routes/utils/createScopedGetRouter.js
api/src/controllers/utils/createScopedCrudController.js
```

## Notes

- `api/src/routes/personas/` is **upstream** dedicated Persona routers (ADR 0021) —
  not NEW; requires markers.
- `api/src/routes/userOrganisations/` and `userOrganisationSettings/` are
  upstream always-on helpers — not NEW; require markers.
