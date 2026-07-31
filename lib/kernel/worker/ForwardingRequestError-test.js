import assert from 'assert';
import ForwardingRequestError from './ForwardingRequestError';

describe('ForwardingRequestError', () => {
  it('stores messageBody for failedForwardingLog enrichment', () => {
    const err = new ForwardingRequestError('Status code was invalid', {
      responseStatus: 502,
      url: 'https://example.test/xapi',
    });
    assert.strictEqual(err.message, 'Status code was invalid');
    assert.strictEqual(err.messageBody.responseStatus, 502);
    assert.ok(err instanceof Error);
  });
});
