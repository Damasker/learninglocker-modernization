/**
 * This hoc is used to allow test rendering of components that use isomorphic-style-loader
 * e.g. withStyles(<Component />)
 * it should not be used outside of tests
 */
// @ll-compat-audit: ok 2026-08-01
import { withContext } from 'recompose';
import PropTypes from 'prop-types';

const withInsertCSS = withContext(
  { insertCss: PropTypes.func },
  () => ({ insertCss: () => ({}) }),
);

export default withInsertCSS;
