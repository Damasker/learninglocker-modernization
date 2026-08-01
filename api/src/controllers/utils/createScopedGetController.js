// @ll-compat-audit: ok 2026-08-01
import mongoose from 'mongoose';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import { buildScopedReadFilter } from 'lib/kernel/api/scopedRead';

const objectId = mongoose.Types.ObjectId;

/**
 * Factory for restify-parity native GET list + GET by id controllers.
 */
export default ({
  Model,
  modelName,
  entityLabel,
  buildFilter = buildScopedReadFilter,
}) => {
  const list = catchErrors(async (req, res) => {
    const authInfo = getAuthFromRequest(req);
    const scopeFilter = await getScopeFilter({
      modelName,
      actionName: 'view',
      authInfo,
    });

    const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
    const parsedFilter = await parseQuery(reqFilter, { authInfo });
    const filter = buildFilter({
      scopeFilter,
      requestFilter: parsedFilter,
    });

    const docs = await Model.find(filter).exec();
    return res.status(200).send(docs);
  });

  const getById = catchErrors(async (req, res) => {
    const authInfo = getAuthFromRequest(req);
    const scopeFilter = await getScopeFilter({
      modelName,
      actionName: 'view',
      authInfo,
    });

    if (!objectId.isValid(req.params.id)) {
      throw new NotFoundError(`${entityLabel} not found for id ${req.params.id}`);
    }

    const filter = buildFilter({
      scopeFilter,
      requestFilter: { _id: objectId(req.params.id) },
    });

    const doc = await Model.findOne(filter).exec();
    if (!doc) {
      throw new NotFoundError(`${entityLabel} not found for id ${req.params.id}`);
    }

    return res.status(200).send(doc);
  });

  return { list, getById };
};
