// @ll-compat-audit: ok 2026-08-01
import withModels from 'ui/utils/hocs/withModels';
import withModelCount from 'ui/utils/hocs/withModelCount';
import { Map } from 'immutable';
import { compose, withProps, defaultProps } from 'recompose';

export default schema => compose(
  defaultProps({ filter: new Map() }),
  withProps({ schema }),
  withModels,
  withModelCount
);
