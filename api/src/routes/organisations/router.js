import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import OrganisationController from 'api/controllers/OrganisationController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

router.get(routes.ORGANISATION, auth, OrganisationController.getOrganisations);
router.get(routes.ORGANISATION_ID, auth, OrganisationController.getOrganisation);
router.post(routes.ORGANISATION, auth, OrganisationController.createOrganisation);
router.put(routes.ORGANISATION_ID, auth, OrganisationController.updateOrganisation);
router.patch(routes.ORGANISATION_ID, auth, OrganisationController.updateOrganisation);
router.delete(routes.ORGANISATION_ID, auth, OrganisationController.deleteOrganisation);

export default router;
