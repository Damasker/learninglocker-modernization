// @ll-compat-audit: ok 2026-08-01
export default function (req) {
  return req.user.authInfo || {};
}
