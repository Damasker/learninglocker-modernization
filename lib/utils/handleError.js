// @ll-compat-audit: ok 2026-08-01
import logger from 'lib/logger';
import { v4 as uuid } from 'uuid';

export default (err) => {
  const errorId = uuid();
  logger.error(errorId, err);
};
