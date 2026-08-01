// @ll-compat-audit: ok 2026-08-01
import styled from 'styled-components';
import { tableDataStyle } from './tableDataStyle';
import { actionsStyle } from './actionsStyle';

export const TableData = styled.td`${tableDataStyle}`;
export const ActionsTableData = styled(TableData)`${actionsStyle}`;
