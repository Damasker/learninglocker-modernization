import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import OrganisationController from 'api/controllers/OrganisationController';

const router = new express.Router();

router.get(
  routes.ORGANISATION,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  OrganisationController.getOrganisations
);

router.get(
  routes.ORGANISATION_ID,
  passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
  OrganisationController.getOrganisation
);

export default router;
