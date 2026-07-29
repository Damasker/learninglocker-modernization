import { isArray, map } from 'lodash';
import Promise from 'bluebird';
import logger from 'lib/logger';
import { getIfiDisplayName } from 'lib/constants/statements';
import asignIdentifierToStatements from 'lib/services/persona/asignIdentifierToStatements';
import getIfiFromActor from 'lib/services/persona/utils/getIfiFromActor';

/**
 * Core post-ingest persona extract for one statement document.
 * Worker wrappers own queue/completion publishing.
 */
export const extractPersonaForStatement = personaService => async (statement) => {
  const ifi = getIfiFromActor(statement.statement.actor);

  // This will only apply to the persona if they are created
  const personaName = statement.statement.actor.name
    ? statement.statement.actor.name
    : getIfiDisplayName(ifi);

  const {
    personaId,
    identifierId,
    wasCreated,
  } = await personaService.createUpdateIdentifierPersona({
    organisation: statement.organisation,
    ifi,
    personaName,
  });

  let display = 'Unknown name';
  try {
    const { persona } = await personaService.getPersona({
      organisation: statement.organisation,
      personaId
    });
    if (persona) {
      display = persona.name;
    }
  } catch (err) {
    logger.error('Error finding person - not updating statement', err);
  }

  if (!wasCreated) {
    statement.personaIdentifier = identifierId;
    statement.person = {
      _id: personaId,
      display,
    };
    await statement.save();
  } else {
    await asignIdentifierToStatements({
      organisation: statement.organisation.toString(),
      toIdentifierId: identifierId
    });
  }
};

export const extractPersonasForStatements = personaService => (statements) => {
  if (isArray(statements)) {
    const handleOne = extractPersonaForStatement(personaService);
    return Promise.all(map(statements, handleOne));
  }
  return extractPersonaForStatement(personaService)(statements);
};

export const extractPersonasStatementHandler = personaService =>
  (statements, done) =>
    extractPersonasForStatements(personaService)(statements)
      .then(() => { done(null); })
      .catch(done);
