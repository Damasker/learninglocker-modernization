import assert from 'assert';
import createMongoClient from './createMongoClient';

describe('persona createMongoClient (Mongo 7 compatible)', () => {
  it('exports an async factory matching persona-service connect shape', () => {
    assert.strictEqual(typeof createMongoClient, 'function');
  });

  it('returns a thenable (Promise) for mongoModelsRepo db config', () => {
    // Do not hit a real Mongo URI in unit tests; only assert Promise shape.
    const original = process.env.MONGODB_PATH;
    process.env.MONGODB_PATH = 'mongodb://127.0.0.1:1/unreachable-persona-test';
    try {
      const result = createMongoClient({ url: process.env.MONGODB_PATH });
      assert.ok(result && typeof result.then === 'function');
      // Swallow connection failure from the unused promise.
      result.catch(() => {});
    } finally {
      if (original === undefined) {
        delete process.env.MONGODB_PATH;
      } else {
        process.env.MONGODB_PATH = original;
      }
    }
  });
});
