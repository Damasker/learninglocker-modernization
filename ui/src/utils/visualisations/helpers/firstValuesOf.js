// @ll-compat-audit: ok 2026-08-01
import { mapValues } from 'lodash';

export default keys =>
  mapValues(keys, (value, key) => ({ $first: `$${key}` }));
