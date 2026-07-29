import assert from 'assert';
import {
  STATEMENTS_AGGREGATE,
  STATEMENTS_AGGREGATE_ASYNC,
  STATEMENTS_COUNT,
  V1_STATEMENTS_AGGREGATE,
} from './routes';
import {
  parseAggregateRequestParams,
  parseAggregateAsyncRequestParams,
  parseCountRequestParams,
  formatAggregateAsyncResponse,
  formatAggregateV1Response,
} from './statementsRequest';

describe('statement analytics route contracts', () => {
  it('freezes aggregate/count path strings', () => {
    assert.strictEqual(STATEMENTS_AGGREGATE, '/statements/aggregate');
    assert.strictEqual(STATEMENTS_AGGREGATE_ASYNC, '/statements/aggregateAsync');
    assert.strictEqual(STATEMENTS_COUNT, '/statements/count');
    assert.strictEqual(V1_STATEMENTS_AGGREGATE, '/v1/statements/aggregate');
  });
});

describe('statement request parsers', () => {
  it('parses aggregate query defaults', () => {
    const params = parseAggregateRequestParams({
      user: { authInfo: { token: { tokenType: 'organisation' } } },
      query: {
        pipeline: '[{"$limit":1}]',
      },
    }, { maxTimeMSDefault: 0 });

    assert.deepStrictEqual(params.pipeline, [{ $limit: 1 }]);
    assert.strictEqual(params.limit, -1);
    assert.strictEqual(params.skip, 0);
    assert.strictEqual(params.cache, false);
    assert.strictEqual(params.maxTimeMS, 0);
    assert.strictEqual(params.sampleSize, undefined);
  });

  it('parses aggregate cache and paging flags', () => {
    const params = parseAggregateRequestParams({
      user: { authInfo: {} },
      query: {
        pipeline: '[]',
        limit: '25',
        skip: '5',
        cache: 'true',
        maxTimeMS: '1000',
        sampleSize: '10',
      },
    });

    assert.strictEqual(params.limit, 25);
    assert.strictEqual(params.skip, 5);
    assert.strictEqual(params.cache, true);
    assert.strictEqual(params.maxTimeMS, 1000);
    assert.strictEqual(params.sampleSize, 10);
  });

  it('parses aggregateAsync sinceAt default', () => {
    const params = parseAggregateAsyncRequestParams({
      user: { authInfo: { a: 1 } },
      query: { pipeline: '[]' },
    });
    assert.strictEqual(params.sinceAt, null);
    assert.deepStrictEqual(params.authInfo, { a: 1 });
  });

  it('formats async and v1 response envelopes', () => {
    const asyncJson = formatAggregateAsyncResponse({
      result: [{ total: 1 }],
      startedAt: '2020-01-01',
      completedAt: '2020-01-02',
      isRunning: false,
    });
    assert.deepStrictEqual(JSON.parse(asyncJson), {
      result: [{ total: 1 }],
      status: {
        startedAt: '2020-01-01',
        completedAt: '2020-01-02',
        isRunning: false,
      },
    });

    assert.strictEqual(
      formatAggregateV1Response('[1,2]'),
      '{ "waitedMS": 0, "result": [1,2], "ok": 1 }'
    );
  });

  it('parses count filter preferring filter over query', () => {
    const params = parseCountRequestParams({
      query: {
        filter: '{"organisation":"org-1"}',
        query: '{"organisation":"org-2"}',
        maxTimeMS: '50',
        hint: '{"organisation":1}',
      },
      user: { authInfo: { token: { tokenType: 'client' } } },
    }, { maxTimeMSDefault: 0 });

    assert.deepStrictEqual(params.filter, { organisation: 'org-1' });
    assert.strictEqual(params.maxTimeMS, 50);
    assert.deepStrictEqual(params.hint, { organisation: 1 });
  });
});
