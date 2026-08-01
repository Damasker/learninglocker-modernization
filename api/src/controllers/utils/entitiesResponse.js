// @ll-compat-audit: ok 2026-08-01
import { replaceId, replaceIds } from './replaceIds';

export const entityResponse = (res, entity) => res.status(200).send(replaceId(entity));

export const entitiesResponse = (res, entities) => res.status(200).send(replaceIds(entities));
