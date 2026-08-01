// @ll-compat-audit: ok 2026-08-01
import { saveCachePaths, saveCacheValues } from 'lib/services/querybuildercache';

export default (caches, organisation, pathsBatch, valuesBatch) => {
  saveCachePaths(caches, organisation, pathsBatch);
  saveCacheValues(caches, organisation, valuesBatch);
};
