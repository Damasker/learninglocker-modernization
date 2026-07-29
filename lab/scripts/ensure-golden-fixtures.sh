#!/usr/bin/env bash
set -euo pipefail

# Run a JS snippet against the lab Mongo container.
# Mongo 7 images ship mongosh; Mongo 4.2 images ship legacy `mongo`.
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

ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
LRS_ID="${LAB_LRS_ID:-bbbbbbbbbbbbbbbbbbbbbbbb}"
CLIENT_ID="${LAB_CLIENT_ID:-cccccccccccccccccccccccc}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
DB_NAME="${LAB_DB_NAME:-learninglocker_v2}"

mongo_eval "
const orgId = ObjectId('${ORG_ID}');
const lrsId = ObjectId('${LRS_ID}');
const clientId = ObjectId('${CLIENT_ID}');
const dbn = db.getSiblingDB('${DB_NAME}');

dbn.organisations.update(
  { _id: orgId },
  {
    \$setOnInsert: {
      _id: orgId,
      name: 'Lab Golden Organisation',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  { upsert: true }
);

dbn.lrs.update(
  { _id: lrsId },
  {
    \$set: {
      title: 'Lab Golden LRS',
      description: 'Synthetic store for dual-run golden path',
      organisation: orgId,
      statementCount: 0,
      updatedAt: new Date()
    },
    \$setOnInsert: {
      _id: lrsId,
      createdAt: new Date()
    }
  },
  { upsert: true }
);

dbn.client.update(
  { _id: clientId },
  {
    \$set: {
      title: 'Lab Golden Client',
      organisation: orgId,
      lrs_id: lrsId,
      scopes: ['xapi/all'],
      isTrusted: true,
      api: {
        basic_key: '${BASIC_KEY}',
        basic_secret: '${BASIC_SECRET}'
      },
      authority: JSON.stringify({
        objectType: 'Agent',
        name: 'Lab Golden Client',
        mbox: 'mailto:lab-golden@example.com'
      }),
      updatedAt: new Date()
    },
    \$setOnInsert: {
      _id: clientId,
      createdAt: new Date()
    }
  },
  { upsert: true }
);

print(JSON.stringify({
  ok: true,
  organisationId: '${ORG_ID}',
  lrsId: '${LRS_ID}',
  clientId: '${CLIENT_ID}',
  basicKey: '${BASIC_KEY}'
}));
"

echo "Golden fixtures ensured"
