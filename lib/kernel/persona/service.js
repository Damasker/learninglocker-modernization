/**
 * Shared kernel entry for persona-service.
 * Deep package imports stay here so callers do not depend on dist/ paths.
 *
 * Mongo access goes through createMongoClient (mongoose-backed) so persona
 * extract works on MongoDB 7 without OP_QUERY.
 */
import personaService from '@learninglocker/persona-service/dist/service';
import mongoModelsRepo from '@learninglocker/persona-service/dist/mongoModelsRepo';
import createMongoClient from './createMongoClient';

let service;

const getService = () => {
  if (service) return service;

  service = personaService({
    repo: mongoModelsRepo({
      db: createMongoClient({
        url: process.env.MONGODB_PATH,
      }),
    }),
  });

  return service;
};

export default getService;
