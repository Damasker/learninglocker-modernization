// @ll-compat-audit: ok 2026-08-01
import { compose, defaultProps } from 'recompose';
import TextIconButton from './TextIconButton';

const enhanceTextIconButton = compose(
  defaultProps({
    text: 'Confirm',
    icon: 'icon ion-checkmark',
  }),
);

export default enhanceTextIconButton(TextIconButton);

