// @ll-compat-audit: ok 2026-08-01
export default (userObjId, scopes = []) => {
  const userId = userObjId.toString();
  return {
    userId,
    provider: 'native',
    scopes,
    tokenType: 'user',
    tokenId: userId,
  };
};
