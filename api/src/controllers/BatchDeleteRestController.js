// @ll-compat-audit: ok 2026-08-01
import BatchDelete from 'lib/models/batchDelete';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import { getScopeFilter } from 'lib/kernel/auth';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

const reads = createScopedGetController({
  Model: BatchDelete,
  modelName: 'batchdelete',
  entityLabel: 'BatchDelete',
});

/**
 * Restify-parity: preMiddleware scope check runs before CUD 405.
 * Mutations use specialised POSTs (initialise / terminate).
 */
const methodNotAllowedAfterScope = actionName => catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  await getScopeFilter({
    modelName: 'batchdelete',
    actionName,
    authInfo,
    body: req.body,
  });
  return res.sendStatus(405);
});

export default {
  ...reads,
  create: methodNotAllowedAfterScope('create'),
  update: methodNotAllowedAfterScope('edit'),
  remove: methodNotAllowedAfterScope('delete'),
};
