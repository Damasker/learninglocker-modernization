import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';
import * as routes from 'lib/constants/routes';
import StatementController from 'api/controllers/StatementController';

const router = new express.Router();
const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

// ADR 0019: statement analytics GETs behind ENABLE_NATIVE_STATEMENT_AGGREGATE_ROUTER.
router.get(routes.STATEMENTS_AGGREGATE, auth, StatementController.aggregate);
router.get(routes.STATEMENTS_AGGREGATE_ASYNC, auth, StatementController.aggregateAsync);
router.get(routes.STATEMENTS_COUNT, auth, StatementController.count);
router.get(routes.V1_STATEMENTS_AGGREGATE, auth, StatementController.v1aggregate);

export default router;
