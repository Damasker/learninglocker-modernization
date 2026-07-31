/**
 * Restify /v2 model surface used by HttpRoutes.
 * Order matches historical registration where it matters for docs only;
 * express-restify-mongoose mounts each model independently.
 *
 * modelName values are Mongoose modelName strings (case-sensitive as registered).
 * routeSuffix used by /connection and /indexes is modelName.toLowerCase().
 */
export const RESTIFY_V2_MODELS = [
  { modelName: 'Organisation', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_ORGANISATION_ROUTER; writes/expiration remain on restify' },
  { modelName: 'Stream', restify: true, connections: false, indexes: false, notes: 'GET strangler behind ENABLE_NATIVE_STREAM_ROUTER; scope mapped to org filter (was missing)' },
  { modelName: 'Export', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_EXPORT_ROUTER' },
  { modelName: 'Download', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_DOWNLOAD_ROUTER' },
  { modelName: 'Query', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_QUERY_ROUTER' },
  { modelName: 'ImportCsv', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_IMPORT_CSV_ROUTER' },
  { modelName: 'User', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_USER_ROUTER (applies scopeSelect); writes remain on restify' },
  { modelName: 'Client', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_CLIENT_ROUTER; writes remain on restify' },
  { modelName: 'Visualisation', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_VISUALISATION_ROUTER' },
  { modelName: 'Dashboard', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_DASHBOARD_ROUTER' },
  { modelName: 'LRS', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_LRS_ROUTER; writes remain on restify' },
  {
    modelName: 'Statement',
    restify: true,
    connections: true,
    indexes: true,
    notes: 'GET+write strangler behind ENABLE_NATIVE_STATEMENT_ROUTER; create/update 405; delete gated by ENABLE_STATEMENT_DELETION (ADR 0017)',
  },
  { modelName: 'StatementForwarding', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER' },
  { modelName: 'QueryBuilderCache', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER' },
  { modelName: 'QueryBuilderCacheValue', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER' },
  { modelName: 'Role', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_ROLE_ROUTER; writes remain on restify' },
  { modelName: 'PersonaAttribute', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER' },
  { modelName: 'PersonasImport', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER' },
  { modelName: 'PersonasImportTemplate', restify: true, connections: true, indexes: true, notes: 'GET strangler behind ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER; scope mapped to persona filter' },
  { modelName: 'SiteSettings', restify: true, connections: false, indexes: false, notes: 'GET strangler behind ENABLE_NATIVE_SITE_SETTINGS_ROUTER; scope filter is {}' },
  {
    modelName: 'BatchDelete',
    restify: true,
    connections: true,
    indexes: true,
    notes: 'GET+write strangler behind ENABLE_NATIVE_BATCH_DELETE_ROUTER; CUD 405; specialised POSTs initialise/terminate (ADR 0018)',
  },
];

export const RESTIFY_CONNECTION_MODELS = RESTIFY_V2_MODELS
  .filter(model => model.connections)
  .map(model => model.modelName);

export const getRestifyRouteSuffix = modelName => modelName.toLowerCase();
