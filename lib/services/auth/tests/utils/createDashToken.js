// @ll-compat-audit: ok 2026-08-01
import {
  TEST_DASH_ID
} from 'lib/services/auth/tests/utils/constants';

const tokenId = TEST_DASH_ID.toString();

export default scopes => ({
  tokenId,
  tokenType: 'dashboard',
  provider: 'native',
  filter: { test: 1 },
  scopes
});
