import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import ClientController from 'api/controllers/ClientController';

const router = new express.Router();

router.get(
  routes.CLIENT,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ClientController.getClients
);

router.get(
  routes.CLIENT_ID,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  ClientController.getClient
);

export default router;
