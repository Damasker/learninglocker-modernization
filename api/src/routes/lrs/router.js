import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import LrsController from 'api/controllers/LrsController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

router.get(routes.LRS, auth, LrsController.getLrsList);
router.get(routes.LRS_ID, auth, LrsController.getLrs);
router.post(routes.LRS, auth, LrsController.createLrs);
router.put(routes.LRS_ID, auth, LrsController.updateLrs);
router.patch(routes.LRS_ID, auth, LrsController.updateLrs);
router.delete(routes.LRS_ID, auth, LrsController.deleteLrs);

export default router;
