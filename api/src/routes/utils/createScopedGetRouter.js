import express from 'express';
import passport from 'api/auth/passport';
import { DEFAULT_PASSPORT_OPTIONS } from 'lib/constants/auth';

/**
 * Mount GET list + GET by id for a native restify strangler.
 * When write handlers are provided, also mounts POST/PUT/PATCH/DELETE
 * so the same ENABLE_NATIVE_*_ROUTER flag owns the full CRUD surface.
 */
export default ({
  listPath,
  idPath,
  listHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
}) => {
  const router = new express.Router();
  const auth = passport.authenticate(['jwt', 'clientBasic'], DEFAULT_PASSPORT_OPTIONS);

  router.get(listPath, auth, listHandler);
  router.get(idPath, auth, getByIdHandler);

  if (createHandler) {
    router.post(listPath, auth, createHandler);
  }
  if (updateHandler) {
    router.put(idPath, auth, updateHandler);
    router.patch(idPath, auth, updateHandler);
  }
  if (deleteHandler) {
    router.delete(idPath, auth, deleteHandler);
  }

  return router;
};
