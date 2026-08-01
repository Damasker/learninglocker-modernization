// @ll-compat-audit: ok 2026-08-01
import testAdminModel from 'lib/services/auth/tests/utils/testAdminModel';
import { MANAGE_ALL_CLIENTS } from 'lib/constants/orgScopes';

testAdminModel({
  modelName: 'client',
  viewAllScopes: [MANAGE_ALL_CLIENTS],
  editAllScopes: [MANAGE_ALL_CLIENTS],
});
