// @ll-compat-audit: ok 2026-08-01
export const replaceId = ({ id, ...model }) => ({ _id: id, ...model });

export const replaceIds = models => models.map(replaceId);

