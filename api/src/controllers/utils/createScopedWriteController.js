// @ll-compat-audit: ok 2026-08-01
import mongoose from 'mongoose';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import catchErrors from 'api/controllers/utils/catchErrors';
import NotFoundError from 'lib/errors/NotFoundError';
import { getScopeFilter } from 'lib/kernel/auth';
import { buildScopedReadFilter } from 'lib/kernel/api/scopedRead';
import {
  applyOrganisationToBody,
  stripMutableIds,
} from 'lib/kernel/api/scopedWrite';

const objectId = mongoose.Types.ObjectId;

/**
 * Factory for restify-parity native POST/PUT/PATCH/DELETE controllers.
 * Uses the same getScopeFilter actionNames as restify (create/edit/delete).
 */
export default ({
  Model,
  modelName,
  entityLabel,
  buildFilter = buildScopedReadFilter,
  beforeCreate,
  beforeUpdate,
}) => {
  const create = catchErrors(async (req, res) => {
    const authInfo = getAuthFromRequest(req);
    await getScopeFilter({
      modelName,
      actionName: 'create',
      authInfo,
      body: req.body,
    });

    let body = applyOrganisationToBody({
      Model,
      authInfo,
      body: req.body || {},
    });
    body = stripMutableIds({ Model, body });
    if (beforeCreate) {
      body = (await beforeCreate({ body, authInfo, req })) || body;
    }

    const doc = await Model.create(body);
    return res.status(201).send(doc);
  });

  const update = catchErrors(async (req, res) => {
    const authInfo = getAuthFromRequest(req);
    const scopeFilter = await getScopeFilter({
      modelName,
      actionName: 'edit',
      authInfo,
      body: req.body,
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

    let body = applyOrganisationToBody({
      Model,
      authInfo,
      body: req.body || {},
    });
    body = stripMutableIds({ Model, body });
    if (beforeUpdate) {
      body = (await beforeUpdate({ body, authInfo, req, doc })) || body;
    }

    Object.keys(body).forEach((key) => {
      doc.set(key, body[key]);
    });
    const saved = await doc.save();
    return res.status(200).send(saved);
  });

  const remove = catchErrors(async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send('API does not allow bulk deletions');
    }

    const authInfo = getAuthFromRequest(req);
    const scopeFilter = await getScopeFilter({
      modelName,
      actionName: 'delete',
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

    if (Model.auditRemove) {
      await Model.auditRemove(doc, req.user);
    }

    await doc.remove();
    return res.sendStatus(204);
  });

  return { create, update, remove };
};
