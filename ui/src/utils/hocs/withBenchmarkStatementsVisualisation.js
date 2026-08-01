// @ll-compat-audit: ok 2026-08-01
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
    fetchVisualisation
  } from 'ui/redux/modules/visualise';

export default compose(
    connect(() => ({}), fetchVisualisation)
);
