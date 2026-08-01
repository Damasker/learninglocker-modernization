// @ll-compat-audit: ok 2026-08-01
import Role from 'lib/models/role';
import createScopedCrudController from 'api/controllers/utils/createScopedCrudController';
import {
  ROLE_MODEL_NAME,
  buildRoleReadFilter,
} from 'lib/kernel/api/role';

const handlers = createScopedCrudController({
  Model: Role,
  modelName: ROLE_MODEL_NAME,
  entityLabel: 'Role',
  buildFilter: buildRoleReadFilter,
});

export default {
  getRoles: handlers.list,
  getRole: handlers.getById,
  createRole: handlers.create,
  updateRole: handlers.update,
  deleteRole: handlers.remove,
};
