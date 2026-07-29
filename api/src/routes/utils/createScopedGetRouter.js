import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';

/**
 * Mount GET list + GET by id for a native restify strangler.
 */
export default ({ listPath, idPath, listHandler, getByIdHandler }) => {
  const router = new express.Router();

  router.get(
    listPath,
    passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
    listHandler
  );

  router.get(
    idPath,
    passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS),
    getByIdHandler
  );

  return router;
};
