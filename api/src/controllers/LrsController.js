import mongoose from 'mongoose';
import LRS from 'lib/models/lrs';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import {
  LRS_MODEL_NAME,
  buildLrsReadFilter,
} from 'lib/kernel/api/lrs';

const objectId = mongoose.Types.ObjectId;

const getLrsList = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: LRS_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
  const parsedFilter = await parseQuery(reqFilter, { authInfo });
  const filter = buildLrsReadFilter({
    scopeFilter,
    requestFilter: parsedFilter,
  });

  const stores = await LRS.find(filter).exec();
  return res.status(200).send(stores);
});

const getLrs = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: LRS_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`LRS not found for id ${req.params.id}`);
  }

  const filter = buildLrsReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const store = await LRS.findOne(filter).exec();
  if (!store) {
    throw new NotFoundError(`LRS not found for id ${req.params.id}`);
  }

  return res.status(200).send(store);
});

export default {
  getLrsList,
  getLrs,
};
