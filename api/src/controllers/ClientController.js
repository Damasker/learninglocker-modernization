import mongoose from 'mongoose';
import Client from 'lib/models/client';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';
import parseQuery from 'lib/helpers/parseQuery';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import {
  CLIENT_MODEL_NAME,
  buildClientReadFilter,
} from 'lib/kernel/api/client';

const objectId = mongoose.Types.ObjectId;

const getClients = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: CLIENT_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  const reqFilter = getJSONFromQuery(req, 'query', getJSONFromQuery(req, 'filter', {}));
  const parsedFilter = await parseQuery(reqFilter, { authInfo });
  const filter = buildClientReadFilter({
    scopeFilter,
    requestFilter: parsedFilter,
  });

  const clients = await Client.find(filter).exec();
  return res.status(200).send(clients);
});

const getClient = catchErrors(async (req, res) => {
  const authInfo = getAuthFromRequest(req);
  const scopeFilter = await getScopeFilter({
    modelName: CLIENT_MODEL_NAME,
    actionName: 'view',
    authInfo,
  });

  if (!objectId.isValid(req.params.id)) {
    throw new NotFoundError(`Client not found for id ${req.params.id}`);
  }

  const filter = buildClientReadFilter({
    scopeFilter,
    requestFilter: { _id: objectId(req.params.id) },
  });

  const client = await Client.findOne(filter).exec();
  if (!client) {
    throw new NotFoundError(`Client not found for id ${req.params.id}`);
  }

  return res.status(200).send(client);
});

export default {
  getClients,
  getClient,
};
