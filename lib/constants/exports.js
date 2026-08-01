// @ll-compat-audit: ok 2026-08-01
const defaultProjection = JSON.stringify({
  _id: 1,
  version: '$statement.version',
  id: '$statement.id',
  timestamp: '$statement.timestamp',
  stored: '$statement.stored',
  actor: '$statement.actor',
  verb: '$statement.verb',
  object: '$statement.object',
  result: '$statement.result',
  authority: '$statement.authority',
  context: '$statement.context',
});

export {
  defaultProjection //eslint-disable-line
};
