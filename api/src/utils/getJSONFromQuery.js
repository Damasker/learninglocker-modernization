// @ll-compat-audit: ok 2026-08-01
import getFromQuery from 'api/utils/getFromQuery';

export default (req, key, defaultValue) =>
  getFromQuery(req, key, defaultValue, JSON.parse.bind(JSON));
