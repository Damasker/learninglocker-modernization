/**
 * Redis notify contract between xapi-service and the LL worker.
 * Suffixes are prefixed with REDIS_PREFIX via cachePrefix().
 */
export const STATEMENT_NOTIFY_CHANNEL_SUFFIX = 'statement.notify';
export const STATEMENT_NEW_LIST_SUFFIX = 'statement.new';
