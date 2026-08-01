// @ll-compat-audit: ok 2026-08-01
import { compose, defaultProps } from 'recompose';
import TextIconButton from './TextIconButton';

const enhanceTextIconButton = compose(
  defaultProps({
    icon: 'ion ion-plus',
  }),
);

export default enhanceTextIconButton(TextIconButton);

