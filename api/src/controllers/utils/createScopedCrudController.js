import createScopedGetController from 'api/controllers/utils/createScopedGetController';
import createScopedWriteController from 'api/controllers/utils/createScopedWriteController';

/**
 * Combined GET + write factory for restify-parity native CRUD stranglers.
 */
export default (opts) => ({
  ...createScopedGetController(opts),
  ...createScopedWriteController(opts),
});
