// @ll-compat-audit: ok 2026-08-01
import Dashboard from 'lib/models/dashboard';
import testId from 'api/routes/tests/utils/testId';
import ownerId from 'api/routes/tests/utils/ownerId';

export default (opts = { _id: testId }) =>
  Dashboard.create({
    name: 'Test dashboard',
    owner: ownerId,
    organisation: testId,
    ...opts
  });
