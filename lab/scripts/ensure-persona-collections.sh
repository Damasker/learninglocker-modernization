#!/usr/bin/env bash
set -euo pipefail

mongo_eval() {
  local js="$1"
  if docker exec -i ll-mongo-1 mongosh --quiet --eval "${js}" >/tmp/ll-mongo-eval.out 2>/tmp/ll-mongo-eval.err; then
    cat /tmp/ll-mongo-eval.out
    return 0
  fi
  if docker exec -i ll-mongo-1 mongo --quiet --eval "${js}" >/tmp/ll-mongo-eval.out 2>/tmp/ll-mongo-eval.err; then
    cat /tmp/ll-mongo-eval.out
    return 0
  fi
  echo "mongo_eval failed:" >&2
  cat /tmp/ll-mongo-eval.err >&2 || true
  return 1
}

mongo_eval '
const dbn = db.getSiblingDB("learninglocker_v2");
try { dbn.createCollection("personas"); } catch (e) {}
try { dbn.createCollection("personaIdentifiers"); } catch (e) {}
dbn.personas.createIndex({ organisation: 1 }, { background: true });
dbn.personaIdentifiers.createIndex({ organisation: 1, "ifi.key": 1, "ifi.value": 1 }, { unique: true, background: true });
printjson({
  personas: dbn.getCollectionNames().indexOf("personas") >= 0,
  personaIdentifiers: dbn.getCollectionNames().indexOf("personaIdentifiers") >= 0
});
'
