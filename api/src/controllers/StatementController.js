// @ll-compat-audit: ok 2026-08-01
import catchErrors from 'api/controllers/utils/catchErrors';
import {
  aggregate,
  aggregateAsync,
  countStatements,
  parseAggregateRequestParams,
  parseAggregateAsyncRequestParams,
  parseCountRequestParams,
  formatAggregateAsyncResponse,
  formatAggregateV1Response,
} from 'lib/kernel/api/statements';

const runAggregate = req => aggregate(parseAggregateRequestParams(req));

const aggregateStatements = catchErrors(async (req, res) => {
  const results = await runAggregate(req);
  res.set('Content-Type', 'application/json');
  res.write(results);
  return res.end();
});

const aggregateAsyncStatements = catchErrors(async (req, res) => {
  const resultsAndStatus = await aggregateAsync(parseAggregateAsyncRequestParams(req));
  const result = formatAggregateAsyncResponse(resultsAndStatus);
  res.set('Content-Type', 'application/json');
  res.write(result);
  return res.end();
});

const aggregateStatementsV1 = catchErrors(async (req, res) => {
  const results = await runAggregate(req);
  const strRes = formatAggregateV1Response(results);
  res.set('Content-Type', 'application/json');
  res.write(strRes);
  return res.end();
});

const countStatementsHandler = catchErrors(async (req, res) => {
  const count = await countStatements(parseCountRequestParams(req));
  return res.status(200).send({ count });
});

export default {
  aggregate: aggregateStatements,
  aggregateAsync: aggregateAsyncStatements,
  v1aggregate: aggregateStatementsV1,
  count: countStatementsHandler
};
