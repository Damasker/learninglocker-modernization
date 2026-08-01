// @ll-compat-audit: ok 2026-08-01
import Lrs from 'lib/models/lrs';
import testId from 'api/routes/tests/utils/testId';

export default (organisation = testId, overrides = {}) =>
  Lrs.create({
    _id: testId,
    owner_id: testId,
    organisation,
    title: 'Test store',
    description: 'Test',
    ...overrides
  });
