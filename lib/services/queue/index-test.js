import { expect } from 'chai';
import {
  publish,
  subscribe,
  unsubscribeAll
} from './index';

describe('Queue provider selection', () => {
  const originalProvider = process.env.QUEUE_PROVIDER;
  const originalNamespace = process.env.QUEUE_NAMESPACE;

  beforeEach(() => {
    process.env.QUEUE_PROVIDER = 'LOCAL';
    process.env.QUEUE_NAMESPACE = 'TEST';
  });

  afterEach(async () => {
    process.env.QUEUE_PROVIDER = 'LOCAL';
    await unsubscribeAll();
    if (originalProvider === undefined) {
      delete process.env.QUEUE_PROVIDER;
    } else {
      process.env.QUEUE_PROVIDER = originalProvider;
    }
    if (originalNamespace === undefined) {
      delete process.env.QUEUE_NAMESPACE;
    } else {
      process.env.QUEUE_NAMESPACE = originalNamespace;
    }
  });

  it('loads and uses only the configured provider', async () => {
    const payload = { test: 'lazy provider' };
    let received;

    await subscribe({
      queueName: 'provider-selection',
      handler: (item, done) => {
        received = item;
        done();
      }
    });
    await publish({
      queueName: 'provider-selection',
      payload
    });

    expect(received).to.deep.equal(payload);
  });

  it('rejects an invalid provider', async () => {
    process.env.QUEUE_PROVIDER = 'INVALID';

    try {
      await new Promise((resolve, reject) => {
        publish({
          queueName: 'provider-selection',
          payload: {}
        }, err => (err ? reject(err) : resolve()));
      });
      throw new Error('Expected publish to reject');
    } catch (err) {
      expect(err.message).to.equal('INVALID is not a valid queue provider');
    }
  });
});
