// @ll-compat-audit: ok 2026-08-01
import { TEST_ORG_ID } from 'lib/services/auth/tests/utils/constants';

export default userId => ({
  _id: userId,
  organisations: [TEST_ORG_ID]
});
