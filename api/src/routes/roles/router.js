import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import RoleController from 'api/controllers/RoleController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

router.get(routes.ROLE, auth, RoleController.getRoles);
router.get(routes.ROLE_ID, auth, RoleController.getRole);
router.post(routes.ROLE, auth, RoleController.createRole);
router.put(routes.ROLE_ID, auth, RoleController.updateRole);
router.patch(routes.ROLE_ID, auth, RoleController.updateRole);
router.delete(routes.ROLE_ID, auth, RoleController.deleteRole);

export default router;
