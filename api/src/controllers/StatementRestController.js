import boolean from 'boolean';
import { get } from 'lodash';
import mongoose from 'mongoose';
import Statement from 'lib/models/statement';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import createScopedGetController from 'api/controllers/utils/createScopedGetController';
import { buildScopedReadFilter } from 'lib/kernel/api/scopedRead';

const objectId = mongoose.Types.ObjectId;

const reads = createScopedGetController({
  Model: Statement,
  modelName: 'statement',
  entityLabel: 'Statement',
});

/**
 * Restify-parity: Statement create/update are permanently Method Not Allowed.
 */
const methodNotAllowed = (req, res) => res.sendStatus(405);

/**
 * Restify-parity Statement delete: gated by ENABLE_STATEMENT_DELETION + scope.
 */
const remove = catchErrors(async (req, res) => {
  if (!boolean(get(process.env, 'ENABLE_STATEMENT_DELETION', true))) {
    return res.status(405).send('Statement deletions not enabled for this instance');
  }
  if (!req.params.id) {
    return res.status(400).send('No ID sent');
  }

  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: 'statement',
    actionName: 'delete',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`Statement not found for id ${req.params.id}`);
  }

  const filter = buildScopedReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const doc = await Statement.findOne(filter).exec();
  if (!doc) {
    throw new NotFoundError(`Statement not found for id ${req.params.id}`);
  }

  await doc.remove();
  return res.sendStatus(204);
});

export default {
  ...reads,
  create: methodNotAllowed,
  update: methodNotAllowed,
  remove,
};
