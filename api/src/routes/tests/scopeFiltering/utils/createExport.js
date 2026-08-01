// @ll-compat-audit: ok 2026-08-01
import Export from 'lib/models/export';
import testId from 'api/routes/tests/utils/testId';

export default (overrides = {}) =>
  Export.create({
    owner: testId,
    organisation: testId,
    name: 'Test export',
    projections: JSON.stringify([
      {
        _id: 1,
        version: '$statement.version'
      }
    ]),
    ...overrides
  });
