// @ll-compat-audit: ok 2026-08-01
import { Iterable } from 'immutable';

const setReviver = (key, value) => {
  const isIndexed = Iterable.isIndexed(value);
  return isIndexed ? value.toSet() : value.toMap();
};

export {
  setReviver //eslint-disable-line
};
