// @ll-compat-audit: ok 2026-08-01
export default (orgId, scopes = []) => ({
  token: {
    tokenType: 'organisation',
    tokenId: orgId.toString(),
    scopes,
  }
});
