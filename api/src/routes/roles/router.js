import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import RoleController from 'api/controllers/RoleController';

const router = new express.Router();

router.get(
  routes.ROLE,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  RoleController.getRoles
);

router.get(
  routes.ROLE_ID,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  RoleController.getRole
);

export default router;
