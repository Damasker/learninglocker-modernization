// @ll-compat-audit: ok 2026-08-01
export default (req) => {
  if (req.method === 'GET') return 'view';
  if (req.method === 'DELETE') return 'delete';
  if (req.method === 'POST' && !req.params.id) return 'create';
  return 'edit';
};
