// @ll-compat-audit: ok 2026-08-01
import { keyframes } from 'styled-components';

export const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
`;
