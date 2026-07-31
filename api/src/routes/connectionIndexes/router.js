import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import { RESTIFY_V2_MODELS } from 'lib/kernel/api/restifyModels';
import generateConnectionController from 'api/controllers/ConnectionController';
import generateIndexesController from 'api/controllers/IndexesController';

import LRS from 'lib/models/lrs';
import Client from 'lib/models/client';
import User from 'lib/models/user';
import Organisation from 'lib/models/organisation';
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
import BatchDelete from 'lib/models/batchDelete';

const modelsByName = {
  Organisation,
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
  BatchDelete,
};

const connectionAuth = (req, res, next) => passport.authenticate(
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

const router = new express.Router();

RESTIFY_V2_MODELS
  .filter(model => model.connections)
  .forEach((entry) => {
    const model = modelsByName[entry.modelName];
    if (!model) {
      throw new Error(`Missing mongoose model for connection/indexes entry ${entry.modelName}`);
    }
    const routeSuffix = model.modelName.toLowerCase();
    router.get(
      `${routes.CONNECTION}/${routeSuffix}`,
      connectionAuth,
      generateConnectionController(model)
    );
    router.get(
      `${routes.INDEXES}/${routeSuffix}`,
      connectionAuth,
      generateIndexesController(model)
    );
  });

export default router;
