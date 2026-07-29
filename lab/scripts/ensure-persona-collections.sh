#!/usr/bin/env bash
set -euo pipefail
docker exec ll-mongo-1 mongosh --quiet --eval '
const dbn = db.getSiblingDB("learninglocker_v2");
dbn.createCollection("personas");
dbn.createCollection("personaIdentifiers");
dbn.personas.createIndex({ organisation: 1 }, { background: true });
dbn.personaIdentifiers.createIndex({ organisation: 1, "ifi.key": 1, "ifi.value": 1 }, { unique: true, background: true });
printjson({
  personas: dbn.getCollectionNames().includes("personas"),
  personaIdentifiers: dbn.getCollectionNames().includes("personaIdentifiers")
});
'
