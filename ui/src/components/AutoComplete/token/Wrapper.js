// @ll-compat-audit: ok 2026-08-01
import styled from 'styled-components';

export default styled.div`
  border-radius: 2px;
  background: #fff;
  margin: 3px;
  overflow: hidden;
  border: 1px solid #ccc;
  display: inline-flex;
  height: 100%;

  &.fullWidth {
    flex-grow: 1;
    border: none;
  }
`;
