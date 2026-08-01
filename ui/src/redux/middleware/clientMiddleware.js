// @ll-compat-audit: ok 2026-08-01
export default function clientMiddleware(llClient) {
  return () => next => action => next({ ...action, llClient });
}
