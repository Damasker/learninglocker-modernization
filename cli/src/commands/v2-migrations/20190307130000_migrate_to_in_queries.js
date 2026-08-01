// @ll-compat-audit: ok 2026-08-01
import migrateToInQueries from '../migrateToInQueries';
import migrateFromInQueries from '../migrateFromInQueries';

const up = async () => {
  await migrateToInQueries();
};

const down = async () => {
  await migrateFromInQueries();
};

export default { up, down };
