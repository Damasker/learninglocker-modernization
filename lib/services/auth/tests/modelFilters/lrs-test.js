// @ll-compat-audit: ok 2026-08-01
import testGlobalModel from 'lib/services/auth/tests/utils/testGlobalModel';
import { MANAGE_ALL_STORES } from 'lib/constants/orgScopes';

testGlobalModel({
  modelName: 'lrs',
  editAllScopes: [MANAGE_ALL_STORES],
});
