#!/usr/bin/env bash
set -euo pipefail

# Idempotent single-node replica set init for lab Mongo.
# Usage: ./init-replica.sh [mongo|mongosh]

MONGO_CLI="${1:-}"
if [[ -z "${MONGO_CLI}" ]]; then
  if docker compose -p ll exec -T mongo mongosh --version >/dev/null 2>&1; then
    MONGO_CLI=mongosh
  else
    MONGO_CLI=mongo
  fi
fi

echo "Using CLI: ${MONGO_CLI}"

docker compose -p ll exec -T mongo "${MONGO_CLI}" --quiet --eval '
try {
  const s = rs.status();
  if (s.ok) {
    print("replica set already initialized: " + s.set);
    quit(0);
  }
} catch (e) {
  // not initialized yet
}

const result = rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "127.0.0.1:27017" }]
});
printjson(result);
'
