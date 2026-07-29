#!/usr/bin/env bash
set -euo pipefail

# Ensure synthetic Organisation / LRS / Client for golden-path xAPI posts.
# Fixed ObjectIds and basic auth so dual-run hosts share identical credentials.
# Usage: ./ensure-golden-fixtures.sh

ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
LRS_ID="${LAB_LRS_ID:-bbbbbbbbbbbbbbbbbbbbbbbb}"
CLIENT_ID="${LAB_CLIENT_ID:-cccccccccccccccccccccccc}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
DB_NAME="${LAB_DB_NAME:-learninglocker_v2}"

mongo_eval() {
  docker exec -i ll-mongo-1 mongosh --quiet --eval "$1"
}

mongo_eval "
const orgId = ObjectId('${ORG_ID}');
const lrsId = ObjectId('${LRS_ID}');
const clientId = ObjectId('${CLIENT_ID}');
const dbn = db.getSiblingDB('${DB_NAME}');

dbn.organisations.updateOne(
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

dbn.lrs.updateOne(
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

dbn.client.updateOne(
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
