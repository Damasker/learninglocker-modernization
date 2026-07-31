import { getConnection } from 'lib/connections/mongoose';

/**
 * Persona-service historically called MongoClient.connect from mongodb@2,
 * which speaks OP_QUERY and breaks on MongoDB 5.1+ (lab Mongo 7).
 *
 * Reuse the app mongoose connection (mongodb@3 via mongoose) and return its
 * native Db so mongoModelsRepo keeps the same collection API.
 *
 * Signature matches persona-service createMongoClient({ url, options }).
 */
export default async function createMongoClient(_opts = {}) {
  const connection = getConnection();

  if (connection.readyState === 1 && connection.db) {
    return connection.db;
  }

  await new Promise((resolve, reject) => {
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    const cleanup = () => {
      connection.removeListener('open', onOpen);
      connection.removeListener('connected', onOpen);
      connection.removeListener('error', onError);
    };

    connection.once('open', onOpen);
    connection.once('connected', onOpen);
    connection.once('error', onError);

    // Already connected between the readyState check and listener attach.
    if (connection.readyState === 1 && connection.db) {
      cleanup();
      resolve();
    }
  });

  if (!connection.db) {
    throw new Error('Mongoose connection opened without a native Db');
  }

  return connection.db;
}
