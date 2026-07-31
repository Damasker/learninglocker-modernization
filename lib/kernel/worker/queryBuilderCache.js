import QueryBuilderCache from 'lib/models/querybuildercache';
import QueryBuilderCacheValue from 'lib/models/querybuildercachevalue';
import { each, isArray } from 'lodash';
import {
  getCachesFromStatement,
  saveCachePaths,
  saveCacheValues
} from 'lib/services/querybuildercache';
import Promise from 'bluebird';

const promiseResolver = (cachePathsBatch, cacheValuesBatch, done) => Promise.all([
  cachePathsBatch.execute({ w: 0 }), // write concern set to 0 to supress warnings of duplicate key errors
  cacheValuesBatch.execute({ w: 0 }) //  these are expected, letting mongo assert the uniqueness is the fastest way
])
  .then((result) => {
    done(null, result);
  })
  .catch((err) => {
    done(err);
  });

const handleStatement = (pathsBatch, valuesBatch, statement) => {
  const organisation = statement.organisation;
  const caches = getCachesFromStatement(statement);
  saveCachePaths(caches, organisation, pathsBatch);
  saveCacheValues(caches, organisation, valuesBatch);
};

/**
 * Core query-builder cache update for one or many statements.
 * Worker wrappers own queue/completion publishing.
 */
export const queryBuilderCacheStatementHandler = (statements, done) => {
  const pathsBatch = QueryBuilderCache.collection.initializeUnorderedBulkOp();
  const valuesBatch = QueryBuilderCacheValue.collection.initializeUnorderedBulkOp();

  if (isArray(statements)) {
    each(statements, handleStatement.bind(null, pathsBatch, valuesBatch));
  } else {
    handleStatement(pathsBatch, valuesBatch, statements);
  }

  return promiseResolver(pathsBatch, valuesBatch, done);
};
