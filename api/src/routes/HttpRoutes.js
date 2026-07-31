import boolean from 'boolean';
import express from 'express';
import restify from 'express-restify-mongoose';
import git from 'git-rev';
import Promise from 'bluebird';
import {
  omit,
  findIndex,
  get,
  pick
} from 'lodash';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import {
  getTokenTypeFromAuthInfo,
  getScopesFromAuthInfo,
  getUserIdFromAuthInfo,
  MANAGER_SELECT,
  SITE_ADMIN,
} from 'lib/kernel/auth';
import { jsonSuccess, serverError } from 'api/utils/responses';
import passport from 'api/auth/passport';

// CONTROLLERS
import AuthController from 'api/controllers/AuthController';
import UploadController from 'api/controllers/UploadController';
import DownloadController from 'api/controllers/DownloadController';
import ExportController from 'api/controllers/ExportController';
import StatementController from 'api/controllers/StatementController';
import generateConnectionController from 'api/controllers/ConnectionController';
import generateIndexesController from 'api/controllers/IndexesController';
import ImportPersonasController from 'api/controllers/ImportPersonasController';
import StatementMetadataController from 'api/controllers/StatementMetadataController';
import BatchDeleteController from 'api/controllers/BatchDeleteController';
import RequestAppAccessController from 'api/controllers/RequestAppAccessController';

// MODELS
import LRS from 'lib/models/lrs';
import Client from 'lib/models/client';
import User from 'lib/models/user';
import Organisation from 'lib/models/organisation';
import Stream from 'lib/models/stream';
import Export from 'lib/models/export';
import Download from 'lib/models/download';
import Query from 'lib/models/query';
import ImportCsv from 'lib/models/importcsv';
import Statement from 'lib/models/statement';
import StatementForwarding from 'lib/models/statementForwarding';
import Visualisation from 'lib/models/visualisation';
import Dashboard from 'lib/models/dashboard';
import QueryBuilderCache from 'lib/models/querybuildercache';
import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import Role from 'lib/models/role';
import PersonaAttribute from 'lib/models/personaAttribute';
import PersonasImport from 'lib/models/personasImport';
import PersonasImportTemplate from 'lib/models/personasImportTemplate';
import SiteSettings from 'lib/models/siteSettings';
import BatchDelete from 'lib/models/batchDelete';
import {
  RESTIFY_V2_MODELS,
} from 'lib/kernel/api/restifyModels';

// REST
import personaRESTHandler from 'api/routes/personas/personaRESTHandler';
import personaIdentifierRESTHandler from 'api/routes/personas/personaIdentifierRESTHandler';
import UserOrganisationsRouter from 'api/routes/userOrganisations/router';
import UserOrganisationSettingsRouter from 'api/routes/userOrganisationSettings/router';
import clientRouter from 'api/routes/clients/router';
import lrsRouter from 'api/routes/lrs/router';
import organisationRouter from 'api/routes/organisations/router';
import roleRouter from 'api/routes/roles/router';
import userRouter from 'api/routes/users/router';
import dashboardRouter from 'api/routes/dashboards/router';
import visualisationRouter from 'api/routes/visualisations/router';
import queryRouter from 'api/routes/queries/router';
import exportRouter from 'api/routes/exports/router';
import downloadRouter from 'api/routes/downloads/router';
import personaAttributeRouter from 'api/routes/personaAttributes/router';
import personasImportRouter from 'api/routes/personasImports/router';
import personasImportTemplateRouter from 'api/routes/personasImportTemplates/router';
import importCsvRouter from 'api/routes/importCsv/router';
import siteSettingsRouter from 'api/routes/siteSettings/router';
import streamRouter from 'api/routes/streams/router';
import batchDeleteRouter from 'api/routes/batchDeletes/router';
import { isNativeClientRouterEnabled } from 'lib/kernel/api/client';
import { isNativeLrsRouterEnabled } from 'lib/kernel/api/lrs';
import { isNativeOrganisationRouterEnabled } from 'lib/kernel/api/organisation';
import { isNativeRoleRouterEnabled } from 'lib/kernel/api/role';
import { isNativeUserRouterEnabled } from 'lib/kernel/api/user';
import {
  isNativeDashboardRouterEnabled,
  isNativeVisualisationRouterEnabled,
  isNativeQueryRouterEnabled,
  isNativeExportRouterEnabled,
  isNativeDownloadRouterEnabled,
} from 'lib/kernel/api/analyticsFlags';
import {
  isNativePersonaAttributeRouterEnabled,
  isNativePersonasImportRouterEnabled,
  isNativePersonasImportTemplateRouterEnabled,
  isNativeImportCsvRouterEnabled,
} from 'lib/kernel/api/personaImportFlags';
import {
  isNativeSiteSettingsRouterEnabled,
  isNativeStreamRouterEnabled,
  isNativeBatchDeleteRouterEnabled,
} from 'lib/kernel/api/restrictedFlags';

// CONSTANTS
import * as routes from 'lib/constants/routes';
import {
  GOOGLE_AUTH_OPTIONS,
  DEFAULT_PASSPORT_OPTIONS,
  RESTIFY_DEFAULTS,
  setNoCacheHeaders,
  checkOrg,
} from 'lib/constants/auth';

const router = new express.Router();
router.use(setNoCacheHeaders);

router.get('', (req, res) => res.status(200).send('OK'));
router.get(routes.VERSION, (req, res) => {
  Promise.all([
    new Promise(resolve => git.short(resolve)),
    new Promise(resolve => git.long(resolve)),
    new Promise(resolve => git.branch(resolve)),
    new Promise(resolve => git.tag(resolve))
  ])
    .then(([short, long, branch, tag]) => {
      jsonSuccess(res)({ short, long, branch, tag });
    })
    .catch(serverError(res));
});
router.get(routes.GOOGLE_AUTH, (req, res) => {
  const enabled = boolean(process.env.GOOGLE_ENABLED);
  jsonSuccess(res)({ enabled });
});

/**
 * AUTHORIZATION
 */
router.post(
  routes.AUTH_RESETPASSWORD_REQUEST,
  AuthController.resetPasswordRequest
);
router.post(routes.AUTH_RESETPASSWORD_RESET, AuthController.resetPassword);
router.post(routes.AUTH_JWT_PASSWORD, AuthController.jwt);
router.post(
  routes.AUTH_JWT_ORGANISATION,
  passport.authenticate('jwt', DEFAULT_PASSPORT_OPTIONS),
  AuthController.jwtOrganisation
);

router.post(
  routes.AUTH_JWT_REFRESH,
  AuthController.jwtRefresh,
);

router.get(
  routes.AUTH_CLIENT_INFO,
  passport.authenticate('clientBasic', DEFAULT_PASSPORT_OPTIONS),
  AuthController.clientInfo
);

router.get(
  routes.OAUTH2_FAILED,
  (request, response) => {
    response.send('Authorization failed');
  },
);

router.post(
  routes.OAUTH2_TOKEN,
  AuthController.issueOAuth2AccessToken
);

router.post(
  routes.REQUEST_APP_ACCESS,
  passport.authenticate('jwt', DEFAULT_PASSPORT_OPTIONS),
  RequestAppAccessController.requestAppAccess,
);

/**
 * TWO FACTOR / GOOGLE
 */
if (process.env.GOOGLE_ENABLED) {
  router.get(
    routes.AUTH_JWT_GOOGLE,
    passport.authenticate('google', GOOGLE_AUTH_OPTIONS)
  );

  router.get(
    routes.AUTH_JWT_GOOGLE_CALLBACK,
    (request, response, next) => {
      passport.authenticate(
        'google',
        DEFAULT_PASSPORT_OPTIONS,
        (error, user, info) => {
          const defaultErrorMessage = 'Something bad happened';

          if (!user) {
            response.redirect(`/api${routes.OAUTH2_FAILED}?error=${get(info, 'message', defaultErrorMessage)}`);

            return;
          }

          AuthController.googleSuccess(user, response);
        },
      )(request, response, next);
    },
  );
}

router.get(
  routes.AUTH_JWT_SUCCESS,
  passport.authenticate('jwt', DEFAULT_PASSPORT_OPTIONS),
  AuthController.success
);

/**
 * Personas
 */
router.use(personaRESTHandler);
router.use(personaIdentifierRESTHandler);

// Native Client GET strangler (feature-flagged). When enabled, mounts before restify
// so GET /v2/client(+/:id) hits the kernel-backed controller; writes stay on restify.
if (isNativeClientRouterEnabled()) {
  router.use(clientRouter);
}

// Native LRS GET strangler (feature-flagged). Writes stay on restify.
if (isNativeLrsRouterEnabled()) {
  router.use(lrsRouter);
}

// Native Organisation GET strangler (feature-flagged). Writes stay on restify
// (including site-admin-only expiration preUpdate).
if (isNativeOrganisationRouterEnabled()) {
  router.use(organisationRouter);
}

if (isNativeRoleRouterEnabled()) {
  router.use(roleRouter);
}

if (isNativeUserRouterEnabled()) {
  router.use(userRouter);
}

if (isNativeDashboardRouterEnabled()) {
  router.use(dashboardRouter);
}
if (isNativeVisualisationRouterEnabled()) {
  router.use(visualisationRouter);
}
if (isNativeQueryRouterEnabled()) {
  router.use(queryRouter);
}
if (isNativeExportRouterEnabled()) {
  router.use(exportRouter);
}
if (isNativeDownloadRouterEnabled()) {
  router.use(downloadRouter);
}

if (isNativePersonaAttributeRouterEnabled()) {
  router.use(personaAttributeRouter);
}
if (isNativePersonasImportRouterEnabled()) {
  router.use(personasImportRouter);
}
if (isNativePersonasImportTemplateRouterEnabled()) {
  router.use(personasImportTemplateRouter);
}
if (isNativeImportCsvRouterEnabled()) {
  router.use(importCsvRouter);
}

if (isNativeSiteSettingsRouterEnabled()) {
  router.use(siteSettingsRouter);
}
if (isNativeStreamRouterEnabled()) {
  router.use(streamRouter);
}
if (isNativeBatchDeleteRouterEnabled()) {
  router.use(batchDeleteRouter);
}

/**
 * User Organisations
 */
router.use(UserOrganisationsRouter);

/**
 * User OrganisationSettings
 */
router.use(UserOrganisationSettingsRouter);

/**
 * UPLOADS
 */
router.post(
  routes.UPLOADLOGO,
  passport.authenticate('jwt', DEFAULT_PASSPORT_OPTIONS),
  UploadController.uploadLogo
);

router.post(
  routes.UPLOADPERSONAS,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ImportPersonasController.uploadPersonas
);

router.post(
  routes.IMPORTPERSONAS,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ImportPersonasController.importPersonas
);

router.get(
  routes.IMPORTPERSONASERROR,
  passport.authenticate(['jwt', 'jwt-cookie', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ImportPersonasController.importPersonasError
);

router.post(
  routes.UPLOADJSONPERSONA,
  passport.authenticate(['jwt', 'jwt-cookie', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ImportPersonasController.uploadJsonPersona
);

/**
 * DOWNLOADS
 */
router.get(
  routes.DOWNLOADLOGO,
  passport.authenticate(['jwt', 'jwt-cookie'], DEFAULT_PASSPORT_OPTIONS),
  DownloadController.downloadLogo
);
router.get(
  routes.DOWNLOADEXPORT,
  passport.authenticate(['jwt', 'jwt-cookie'], DEFAULT_PASSPORT_OPTIONS),
  DownloadController.downloadExport
);

/**
 * EXPORTS
 */
router.get(
  routes.EXPORT,
  passport.authenticate('jwt', DEFAULT_PASSPORT_OPTIONS),
  ExportController.downloadExport
);

/**
 * STATEMENTS
 */
router.get(
  routes.STATEMENTS_AGGREGATE,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementController.aggregate
);
router.get(
  routes.STATEMENTS_AGGREGATE_ASYNC,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementController.aggregateAsync
);
router.get(
  routes.STATEMENTS_COUNT,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementController.count
);

router.patch(
  routes.STATEMENT_METADATA,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementMetadataController.patchStatementMetadata
);
router.post(
  routes.STATEMENT_METADATA,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementMetadataController.postStatementMetadata
);

router.post(
  routes.STATEMENT_BATCH_DELETE_INITIALISE,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  BatchDeleteController.initialiseBatchDelete
);

router.post(
  routes.STATEMENT_BATCH_DELETE_TERMINATE_ALL,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  BatchDeleteController.terminateAllBatchDeletes
);

router.post(
  routes.STATEMENT_BATCH_DELETE_TERMINATE,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  BatchDeleteController.terminateBatchDelete
);

/**
 * V1 compatability
 */
router.get(
  routes.V1_STATEMENTS_AGGREGATE,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  StatementController.v1aggregate
);

/**
 * REST APIS
 */
restify.defaults(RESTIFY_DEFAULTS);
restify.serve(router, Organisation, {
  preUpdate: (req, res, next) => {
    const authInfo = getAuthFromRequest(req);
    const scopes = getScopesFromAuthInfo(authInfo);
    if (
      findIndex(scopes, item => item === SITE_ADMIN) < 0
    ) {
      req.body = omit(req.body, 'expiration');
    }
    next();
  }
});
restify.serve(router, Stream);
restify.serve(router, Export);
restify.serve(router, Download);
restify.serve(router, Query);
restify.serve(router, ImportCsv);
restify.serve(router, User, {
  preCreate: (req, res, next) => {
    const authInfo = getAuthFromRequest(req);
    const scopes = getScopesFromAuthInfo(authInfo);
    if (!scopes.includes(SITE_ADMIN)) {
      req.body = pick(req.body, ['name', 'email', 'isExpanded', 'organisations']);
    }
    checkOrg(req, res, next);
  },
  preUpdate: (req, _, next) => {
    const authInfo = getAuthFromRequest(req);
    const scopes = getScopesFromAuthInfo(authInfo);

    // Site admins can update any fields
    if (!scopes.includes(SITE_ADMIN)) {
      const tokenType = getTokenTypeFromAuthInfo(authInfo);
      const isUpdatingItself =
        ['user', 'organisation'].includes(tokenType) &&
        req.body._id === getUserIdFromAuthInfo(authInfo).toString();

      // Non site admin user can update
      // only name and password of the user itself or only name of other users.
      if (isUpdatingItself) {
        req.body = pick(req.body, ['name', 'password']);
      } else {
        req.body = pick(req.body, ['name']);
      }
    }

    next();
  },
  postCreate: (req, _, next) => {
    req.erm.result = pick(req.erm.result, Object.keys(MANAGER_SELECT));
    next();
  },
  postUpdate: (req, _, next) => {
    req.erm.result = pick(req.erm.result, Object.keys(MANAGER_SELECT));
    next();
  },
  postDelete: (req, _, next) => {
    req.erm.result = pick(req.erm.result, Object.keys(MANAGER_SELECT));
    next();
  },
});
restify.serve(router, Client);
restify.serve(router, Visualisation);
restify.serve(router, Dashboard);
restify.serve(router, LRS);
restify.serve(router, Statement, {
  preCreate: (req, res) => res.sendStatus(405),
  preDelete: (req, res, next) => {
    if (!boolean(get(process.env, 'ENABLE_STATEMENT_DELETION', true))) {
      return res.send('Statement deletions not enabled for this instance', 405);
    }
    if (!req.params.id) {
      return res.send('No ID sent', 400);
    }
    next();
  },
  preUpdate: (req, res) => res.sendStatus(405),
});
restify.serve(router, StatementForwarding);
restify.serve(router, QueryBuilderCache);
restify.serve(router, QueryBuilderCacheValue);
restify.serve(router, Role);
restify.serve(router, PersonaAttribute, {
  preDelete: async (req, res, next) => next(),
});
restify.serve(router, PersonasImport);
restify.serve(router, PersonasImportTemplate);
restify.serve(router, SiteSettings);
restify.serve(router, BatchDelete, {
  preCreate: (req, res) => res.sendStatus(405),
  preDelete: (req, res) => res.sendStatus(405),
  preUpdate: (req, res) => res.sendStatus(405)
});

/**
 * CONNECTIONS and INDEXES
 */
const modelsByName = {
  Organisation,
  Stream,
  Export,
  Download,
  Query,
  ImportCsv,
  User,
  Client,
  Visualisation,
  Dashboard,
  LRS,
  Statement,
  StatementForwarding,
  QueryBuilderCache,
  QueryBuilderCacheValue,
  Role,
  PersonaAttribute,
  PersonasImport,
  PersonasImportTemplate,
  SiteSettings,
  BatchDelete,
};

const generatedRouteModels = RESTIFY_V2_MODELS
  .filter(model => model.connections)
  .map((model) => {
    const mongooseModel = modelsByName[model.modelName];
    if (!mongooseModel) {
      throw new Error(`Missing mongoose model for restify registry entry ${model.modelName}`);
    }
    return mongooseModel;
  });

const generateConnectionsRoute = (model, routeSuffix, authentication) => {
  const route = `${routes.CONNECTION}/${routeSuffix}`;
  const controller = generateConnectionController(model);
  router.get(route, authentication, controller);
};

const generateIndexesRoute = (model, routeSuffix, authentication) => {
  const route = `${routes.INDEXES}/${routeSuffix}`;
  const controller = generateIndexesController(model);
  router.get(route, authentication, controller);
};

const generateModelRoutes = (model) => {
  const routeSuffix = model.modelName.toLowerCase();
  const authentication = (req, res, next) => passport.authenticate(
    ['jwt', 'clientBasic'],
    DEFAULT_PASSPORT_OPTIONS,
    (err, user) => {
      if (err || !user) {
        res.status(401).set('Content-Type', 'text/plain').send('Unauthorized');
        return;
      }
      req.user = user;
      next();
    },
  )(req, res, next);
  generateConnectionsRoute(model, routeSuffix, authentication);
  generateIndexesRoute(model, routeSuffix, authentication);
};

generatedRouteModels.map(generateModelRoutes);

export default router;
