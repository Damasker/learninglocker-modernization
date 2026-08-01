// @ll-compat-audit: ok 2026-08-01
export default (identifiers = []) =>
  identifiers.filter(({ key }) =>
    key.indexOf('statement.') !== 0
  ).map(({ key, value }) => ({
    path: key.split('.'),
    value,
    fullValue: value,
    display: value,
  }));
