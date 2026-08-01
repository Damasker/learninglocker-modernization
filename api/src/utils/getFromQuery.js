// @ll-compat-audit: ok 2026-08-01
import _ from 'lodash';

export default (req, key, defaultValue, modifier = _.identity) => (
  _.hasIn(req, ['query', key]) ? modifier(_.get(req, ['query', key])) : defaultValue
);
