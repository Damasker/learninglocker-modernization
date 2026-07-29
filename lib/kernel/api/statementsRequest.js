import defaultTo from 'lodash/defaultTo';
import getAuthFromRequest from 'lib/helpers/getAuthFromRequest';
import getFromQuery from 'api/utils/getFromQuery';
import getJSONFromQuery from 'api/utils/getJSONFromQuery';

export const DEFAULT_MAX_TIME_MS = defaultTo(Number(process.env.MAX_TIME_MS), 0);

/**
 * Parse GET /statements/aggregate(+Async) query params into service options.
 */
export const parseAggregateRequestParams = (req, {
  maxTimeMSDefault = DEFAULT_MAX_TIME_MS,
} = {}) => {
  const authInfo = (req.user && req.user.authInfo) || {};
  return {
    authInfo,
    limit: Number(req.query.limit) || -1,
    skip: Number(req.query.skip) || 0,
    cache: (!!req.query.cache && req.query.cache !== 'false') || false,
    maxTimeMS: Number(req.query.maxTimeMS) || maxTimeMSDefault,
    pipeline: JSON.parse(req.query.pipeline),
    sampleSize: Number(req.query.sampleSize) || undefined,
  };
};

/**
 * Parse GET /statements/aggregateAsync query params.
 */
export const parseAggregateAsyncRequestParams = req => ({
  authInfo: (req.user && req.user.authInfo) || {},
  pipeline: JSON.parse(req.query.pipeline),
  skip: Number(req.query.skip) || 0,
  limit: Number(req.query.limit) || -1,
  sinceAt: req.query.sinceAt || null,
});

/**
 * Parse GET /statements/count query params.
 */
export const parseCountRequestParams = (req, {
  maxTimeMSDefault = DEFAULT_MAX_TIME_MS,
} = {}) => {
  const filter = getJSONFromQuery(
    req,
    'filter',
    getJSONFromQuery(req, 'query', {})
  );
  return {
    authInfo: getAuthFromRequest(req),
    filter,
    maxTimeMS: getFromQuery(req, 'maxTimeMS', maxTimeMSDefault, Number),
    hint: getJSONFromQuery(req, 'hint', null),
  };
};

export const formatAggregateAsyncResponse = (resultsAndStatus) => {
  const payload = {
    result: resultsAndStatus.result,
    status: {
      startedAt: resultsAndStatus.startedAt,
      completedAt: resultsAndStatus.completedAt,
      isRunning: resultsAndStatus.isRunning,
    },
  };
  return JSON.stringify(payload);
};

/**
 * Legacy v1 envelope around aggregate JSON result string.
 */
export const formatAggregateV1Response = resultsJson =>
  `{ "waitedMS": 0, "result": ${resultsJson}, "ok": 1 }`;
