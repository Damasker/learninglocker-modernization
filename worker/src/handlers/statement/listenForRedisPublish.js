// @ll-compat-audit: ok 2026-08-01
import async from 'async';
import logger from 'lib/logger';
import Statement from 'lib/models/statement';
import statementHandler from 'worker/handlers/statement/statementHandler';
import * as redis from 'lib/connections/redis';
import cachePrefix from 'lib/helpers/cachePrefix';
import {
  STATEMENT_NOTIFY_CHANNEL_SUFFIX,
  STATEMENT_NEW_LIST_SUFFIX,
} from 'lib/kernel/worker/notify';

const redisOpts = redis.getOptions();

const parseNotifyPayload = (payload) => {
  try {
    return JSON.parse(payload);
  } catch (err) {
    logger.error('ERROR PARSING REDIS NOTIFY PAYLOAD', err, payload);
    return null;
  }
};

export default () => {
  const subClient = redis.createClient();
  const pubClient = redis.createClient();
  // subscribe channel is not prefixed by bull, so must manually do this!
  const subKey = cachePrefix(STATEMENT_NOTIFY_CHANNEL_SUFFIX);
  const pubKey = cachePrefix(STATEMENT_NEW_LIST_SUFFIX);
  logger.debug('Using redis options:', redisOpts);
  logger.info(`Subscribing to '${subKey}' and will rpop on key '${pubKey}'`);

  let currentlyWorking = false;
  subClient.on('message', (channel) => {
    logger.debug(`Message on channel '${channel}'`);

    if (!currentlyWorking) {
      currentlyWorking = true;
      let latestResult = null;
      // while there are payloads left in the work queue, process them
      async.doUntil(
        (cb) => {
          pubClient.rpop(pubKey, (err, payload) => {
            if (err) {
              logger.error('ERROR ON REDIS RPOP', err);
              return cb(err);
            }
            latestResult = payload;
            if (!payload) {
              return cb();
            }

            logger.debug(`Popped '${pubKey}':`, payload);
            const parsed = parseNotifyPayload(payload);
            if (!parsed || !parsed.statementId) {
              logger.error('INVALID REDIS NOTIFY PAYLOAD', payload);
              return cb();
            }

            return Statement.findOne(
              { 'statement.id': parsed.statementId },
              (findErr, statement) => {
                if (findErr) {
                  logger.error('ERROR LOADING STATEMENT FROM REDIS NOTIFY', findErr);
                  return cb(findErr);
                }
                if (!statement) {
                  logger.info(
                    `Redis notify for missing statement.id ${parsed.statementId}; skipping`
                  );
                  return cb();
                }
                // push it straight into the correct queues
                statementHandler({ statementId: statement._id });
                return cb();
              }
            );
          });
        },
        () => !latestResult,
        () => {
          currentlyWorking = false;
        }
      );
    }
  });
  subClient.subscribe(subKey);
};
