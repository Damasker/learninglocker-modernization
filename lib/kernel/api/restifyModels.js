/**
 * Restify /v2 model surface used by HttpRoutes.
 * Order matches historical registration where it matters for docs only;
 * express-restify-mongoose mounts each model independently.
 *
 * modelName values are Mongoose modelName strings (case-sensitive as registered).
 * routeSuffix used by /connection and /indexes is modelName.toLowerCase().
 */
export const RESTIFY_V2_MODELS = [
  { modelName: 'Organisation', restify: true, connections: true, indexes: true },
  { modelName: 'Stream', restify: true, connections: false, indexes: false },
  { modelName: 'Export', restify: true, connections: true, indexes: true },
  { modelName: 'Download', restify: true, connections: true, indexes: true },
  { modelName: 'Query', restify: true, connections: true, indexes: true },
  { modelName: 'ImportCsv', restify: true, connections: true, indexes: true },
  { modelName: 'User', restify: true, connections: true, indexes: true },
  { modelName: 'Client', restify: true, connections: true, indexes: true },
  { modelName: 'Visualisation', restify: true, connections: true, indexes: true },
  { modelName: 'Dashboard', restify: true, connections: true, indexes: true },
  { modelName: 'LRS', restify: true, connections: true, indexes: true },
  {
    modelName: 'Statement',
    restify: true,
    connections: true,
    indexes: true,
    notes: 'create/update blocked (405); delete gated by ENABLE_STATEMENT_DELETION',
  },
  { modelName: 'StatementForwarding', restify: true, connections: true, indexes: true },
  { modelName: 'QueryBuilderCache', restify: true, connections: true, indexes: true },
  { modelName: 'QueryBuilderCacheValue', restify: true, connections: true, indexes: true },
  { modelName: 'Role', restify: true, connections: true, indexes: true },
  { modelName: 'PersonaAttribute', restify: true, connections: true, indexes: true },
  { modelName: 'PersonasImport', restify: true, connections: true, indexes: true },
  { modelName: 'PersonasImportTemplate', restify: true, connections: true, indexes: true },
  { modelName: 'SiteSettings', restify: true, connections: false, indexes: false },
  {
    modelName: 'BatchDelete',
    restify: true,
    connections: true,
    indexes: true,
    notes: 'create/update/delete blocked (405); mutations via batch-delete controllers',
  },
];

export const RESTIFY_CONNECTION_MODELS = RESTIFY_V2_MODELS
  .filter(model => model.connections)
  .map(model => model.modelName);

export const getRestifyRouteSuffix = modelName => modelName.toLowerCase();
