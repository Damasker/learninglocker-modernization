import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import LrsController from 'api/controllers/LrsController';

const router = new express.Router();

router.get(
  routes.LRS,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  LrsController.getLrsList
);

router.get(
  routes.LRS_ID,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  LrsController.getLrs
);

export default router;
