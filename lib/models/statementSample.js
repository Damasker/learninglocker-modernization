/* eslint-disable import/no-mutable-exports */
// @ll-compat-audit: ok 2026-08-01
import { getConnection } from 'lib/connections/mongoose';
import { schema } from './statement';

const StatementSample = getConnection().model('StatementSample', schema, 'statementSamples');
export default StatementSample;
