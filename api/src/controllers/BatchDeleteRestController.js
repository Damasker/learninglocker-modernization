import BatchDelete from 'lib/models/batchDelete';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';

const reads = createScopedGetController({
  Model: BatchDelete,
  modelName: 'batchdelete',
  entityLabel: 'BatchDelete',
});

/**
 * Restify-parity: BatchDelete CUD via /v2/batchdelete is Method Not Allowed.
 * Mutations use specialised POSTs (initialise / terminate).
 */
const methodNotAllowed = (req, res) => res.sendStatus(405);

export default {
  ...reads,
  create: methodNotAllowed,
  update: methodNotAllowed,
  remove: methodNotAllowed,
};
