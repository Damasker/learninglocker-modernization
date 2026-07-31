import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import UserController from 'api/controllers/UserController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

router.get(routes.USER, auth, UserController.getUsers);
router.get(routes.USER_ID, auth, UserController.getUser);
router.post(routes.USER, auth, UserController.createUser);
router.put(routes.USER_ID, auth, UserController.updateUser);
router.patch(routes.USER_ID, auth, UserController.updateUser);
router.delete(routes.USER_ID, auth, UserController.deleteUser);

export default router;
