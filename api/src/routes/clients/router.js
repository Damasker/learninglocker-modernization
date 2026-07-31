import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import ClientController from 'api/controllers/ClientController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

router.get(routes.CLIENT, auth, ClientController.getClients);
router.get(routes.CLIENT_ID, auth, ClientController.getClient);
router.post(routes.CLIENT, auth, ClientController.createClient);
router.put(routes.CLIENT_ID, auth, ClientController.updateClient);
router.patch(routes.CLIENT_ID, auth, ClientController.updateClient);
router.delete(routes.CLIENT_ID, auth, ClientController.deleteClient);

export default router;
