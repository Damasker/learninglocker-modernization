// @ll-compat-audit: ok 2026-08-01
import styled from 'styled-components';

export default styled.input`
  border: none;
  flex-grow: 1;
  padding-left: 8px;

  &:focus {
    outline: 0;
  }
`;
