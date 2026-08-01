// @ll-compat-audit: ok 2026-08-01
import _ from 'lodash';

const removeEmptyMatch = pipeline =>
   _.filter(pipeline, (stage) => {
     if (_.has(stage, '$match') && _.size(stage.$match) === 0) return false;
     return true;
   })
;

export default removeEmptyMatch;
