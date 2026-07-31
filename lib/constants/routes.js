export const HOME = 'home';

export const RESTIFY_PREFIX = '/v2';

export const AUTH_RESETPASSWORD_REQUEST = '/auth/resetpassword/request';
export const AUTH_RESETPASSWORD_RESET = '/auth/resetpassword/reset';
export const AUTH_JWT_PASSWORD = '/auth/jwt/password';
export const AUTH_JWT_ORGANISATION = '/auth/jwt/organisation';
export const AUTH_JWT_REFRESH = '/auth/jwt/refresh';

export const AUTH_JWT_GOOGLE = '/auth/jwt/google';
export const AUTH_JWT_GOOGLE_CALLBACK = '/auth/jwt/google/callback';
export const AUTH_JWT_SUCCESS = '/auth/jwt/success';

export const AUTH_CLIENT_INFO = '/auth/client/info';

export const OAUTH2_TOKEN = '/oauth2/token';
export const OAUTH2_FAILED = '/oauth2/failed';

export const SENDSMS = '/sendsms';

export const UPLOADLOGO = '/uploadlogo';
export const UPLOADPERSONAS = '/uploadpersonas';
export const IMPORTPERSONAS = '/importpersonas';
export const IMPORTPERSONASERROR = '/organisation/:organisationId/importpersonaserror/:id.csv';
export const UPLOADJSONPERSONA = '/uploadpersona';

export const DOWNLOADLOGO = '/downloadlogo/:org';
export const DOWNLOADEXPORT = '/organisation/:organisationId/downloadexport/:download.csv';

export const EXPORT = '/export';

export const STATEMENTS_AGGREGATE = '/statements/aggregate';
export const STATEMENTS_AGGREGATE_ASYNC = '/statements/aggregateAsync';
export const STATEMENTS_COUNT = '/statements/count';
export const V1_STATEMENTS_AGGREGATE = '/v1/statements/aggregate';

// Persona misc
export const MERGE_PERSONA = '/mergepersona';
export const ASSIGN_PERSONA = '/assignpersona';
export const CREATE_PERSONA_FROM_IDENTIFIER = '/createpersonafromidentifier';

// Persona
export const PERSONA = `${RESTIFY_PREFIX}/persona`;
export const PERSONA_ID = `${RESTIFY_PREFIX}/persona/:personaId`;
export const PERSONA_COUNT = `${RESTIFY_PREFIX}/persona/count`;
export const CONNECTION_PERSONA = '/connection/persona';

// PersonaIdentifier
export const PERSONA_IDENTIFIER = `${RESTIFY_PREFIX}/personaIdentifier`;
export const PERSONA_IDENTIFIER_UPSERT = `${RESTIFY_PREFIX}/personaIdentifier/upsert`;
export const PERSONA_IDENTIFIER_ID = `${RESTIFY_PREFIX}/personaIdentifier/:personaIdentifierId`;
export const PERSONA_IDENTIFIER_COUNT = `${RESTIFY_PREFIX}/personaIdentifier/count`;
export const CONNECTION_PERSONA_IDENTIFIER = '/connection/personaidentifier';

// PersonaAttribute
export const PERSONA_ATTRIBUTE = `${RESTIFY_PREFIX}/personaattribute`;
export const PERSONA_ATTRIBUTE_ID = `${RESTIFY_PREFIX}/personaattribute/:personaAttributeId`;
export const PERSONA_ATTRIBUTE_COUNT = `${RESTIFY_PREFIX}/personaattribute/count`;
export const CONNECTION_PERSONA_ATTRIBUTE = '/connection/personaattribute';

export const CONNECTION = '/connection';
export const INDEXES = '/indexes';

export const VERSION = '/app/version';
export const GOOGLE_AUTH = '/app/googleAuth';

export const STATEMENT_METADATA = `${RESTIFY_PREFIX}/statementmetadata/:id`;
export const STATEMENT_BATCH_DELETE_INITIALISE = `${RESTIFY_PREFIX}/batchdelete/initialise`;
export const STATEMENT_BATCH_DELETE_TERMINATE_ROOT = `${RESTIFY_PREFIX}/batchdelete/terminate`;
export const STATEMENT_BATCH_DELETE_TERMINATE = `${STATEMENT_BATCH_DELETE_TERMINATE_ROOT}/:id`;
export const STATEMENT_BATCH_DELETE_TERMINATE_ALL = `${STATEMENT_BATCH_DELETE_TERMINATE_ROOT}/all`;

export const CLIENT = `${RESTIFY_PREFIX}/client`;
export const CLIENT_ID = `${RESTIFY_PREFIX}/client/:id`;

export const LRS = `${RESTIFY_PREFIX}/lrs`;
export const LRS_ID = `${RESTIFY_PREFIX}/lrs/:id`;

export const ORGANISATION = `${RESTIFY_PREFIX}/organisation`;
export const ORGANISATION_ID = `${RESTIFY_PREFIX}/organisation/:id`;

export const ROLE = `${RESTIFY_PREFIX}/role`;
export const ROLE_ID = `${RESTIFY_PREFIX}/role/:id`;

export const USER = `${RESTIFY_PREFIX}/user`;
export const USER_ID = `${RESTIFY_PREFIX}/user/:id`;

export const DASHBOARD = `${RESTIFY_PREFIX}/dashboard`;
export const DASHBOARD_ID = `${RESTIFY_PREFIX}/dashboard/:id`;

export const VISUALISATION = `${RESTIFY_PREFIX}/visualisation`;
export const VISUALISATION_ID = `${RESTIFY_PREFIX}/visualisation/:id`;

export const QUERY = `${RESTIFY_PREFIX}/query`;
export const QUERY_ID = `${RESTIFY_PREFIX}/query/:id`;

// Restify model paths (distinct from DOWNLOADLOGO / DOWNLOADEXPORT / EXPORT helpers)
export const EXPORT_REST = `${RESTIFY_PREFIX}/export`;
export const EXPORT_REST_ID = `${RESTIFY_PREFIX}/export/:id`;
export const DOWNLOAD_REST = `${RESTIFY_PREFIX}/download`;
export const DOWNLOAD_REST_ID = `${RESTIFY_PREFIX}/download/:id`;

export const PERSONAS_IMPORT = `${RESTIFY_PREFIX}/personasimport`;
export const PERSONAS_IMPORT_ID = `${RESTIFY_PREFIX}/personasimport/:id`;
export const PERSONAS_IMPORT_TEMPLATE = `${RESTIFY_PREFIX}/personasimporttemplate`;
export const PERSONAS_IMPORT_TEMPLATE_ID = `${RESTIFY_PREFIX}/personasimporttemplate/:id`;
export const IMPORT_CSV = `${RESTIFY_PREFIX}/importcsv`;
export const IMPORT_CSV_ID = `${RESTIFY_PREFIX}/importcsv/:id`;

export const SITE_SETTINGS = `${RESTIFY_PREFIX}/sitesettings`;
export const SITE_SETTINGS_ID = `${RESTIFY_PREFIX}/sitesettings/:id`;
export const STREAM = `${RESTIFY_PREFIX}/stream`;
export const STREAM_ID = `${RESTIFY_PREFIX}/stream/:id`;
export const BATCH_DELETE = `${RESTIFY_PREFIX}/batchdelete`;
export const BATCH_DELETE_ID = `${RESTIFY_PREFIX}/batchdelete/:id`;

export const STATEMENT_FORWARDING = `${RESTIFY_PREFIX}/statementforwarding`;
export const STATEMENT_FORWARDING_ID = `${RESTIFY_PREFIX}/statementforwarding/:id`;
export const QUERY_BUILDER_CACHE = `${RESTIFY_PREFIX}/querybuildercache`;
export const QUERY_BUILDER_CACHE_ID = `${RESTIFY_PREFIX}/querybuildercache/:id`;
export const QUERY_BUILDER_CACHE_VALUE = `${RESTIFY_PREFIX}/querybuildercachevalue`;
export const QUERY_BUILDER_CACHE_VALUE_ID = `${RESTIFY_PREFIX}/querybuildercachevalue/:id`;

export const REQUEST_APP_ACCESS = '/requestAppAccess';
export const USER_ORGANISATIONS = `${RESTIFY_PREFIX}/users/:userId/organisations/:organisationId`;
export const USER_ORGANISATION_SETTINGS = `${RESTIFY_PREFIX}/users/:userId/organisationSettings/:organisationId`;
