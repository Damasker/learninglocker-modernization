import assert from 'assert';
import {
  STATEMENT_QUEUE,
  STATEMENT_EXTRACT_PERSONAS_QUEUE,
  STATEMENT_QUERYBUILDERCACHE_QUEUE,
  STATEMENT_FORWARDING_QUEUE,
  STATEMENT_FORWARDING_REQUEST_QUEUE,
  STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE,
  STATEMENT_FORWARDING_DEADLETTER_QUEUE,
} from 'lib/constants/statements';
import {
  STATEMENT_NOTIFY_CHANNEL_SUFFIX,
  STATEMENT_NEW_LIST_SUFFIX,
} from './notify';

describe('worker queue/notify contracts', () => {
  it('freezes durable queue name strings (including historical typo)', () => {
    assert.strictEqual(STATEMENT_QUEUE, 'STATEMENT_QUEUE');
    assert.strictEqual(STATEMENT_EXTRACT_PERSONAS_QUEUE, 'STATEMENT_PERSON_QUEUE');
    assert.strictEqual(STATEMENT_QUERYBUILDERCACHE_QUEUE, 'STATEMENT_QUERYBUILDERCACHE_QUEUE');
    assert.strictEqual(STATEMENT_FORWARDING_QUEUE, 'STATEMENT_FORWARDING_QUEUE');
    // Historical typo REQEUST is intentional and must not be "fixed".
    assert.strictEqual(STATEMENT_FORWARDING_REQUEST_QUEUE, 'STATEMENT_FORWARDING_REQEUST_QUEUE');
    assert.strictEqual(
      STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE,
      'STATEMENT_FORWARDING_REQUEST_DELAYED_QUEUE'
    );
    assert.strictEqual(
      STATEMENT_FORWARDING_DEADLETTER_QUEUE,
      'STATEMENT_FORWARDING_DEADLETTER_QUEUE'
    );
  });

  it('freezes Redis notify suffixes used with REDIS_PREFIX', () => {
    assert.strictEqual(STATEMENT_NOTIFY_CHANNEL_SUFFIX, 'statement.notify');
    assert.strictEqual(STATEMENT_NEW_LIST_SUFFIX, 'statement.new');
  });
});
