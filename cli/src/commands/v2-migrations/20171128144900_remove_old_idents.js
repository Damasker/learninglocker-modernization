// @ll-compat-audit: ok 2026-08-01
import logger from 'lib/logger';
import { getConnection } from 'lib/connections/mongoose';

const up = async () => {
  const connection = getConnection();
  await connection.collection('personaidentifiers').drop();
};

const down = async () => {
  logger.info('Not implemented.');
};

export default { up, down };
