// @ll-compat-audit: ok 2026-08-01
import { MERGE_MODELS } from 'ui/redux/modules/models';
import { fromJS, Iterable } from 'immutable';

export default function immutableMiddleware() {
  return next => (action) => {
    if (action.type === MERGE_MODELS && !Iterable.isIterable(action.models)) {
      return next({ ...action, models: fromJS(action.models) });
    }
    return next(action);
  };
}
