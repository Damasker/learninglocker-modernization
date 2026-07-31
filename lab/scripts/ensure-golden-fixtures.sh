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
USER_ID="${LAB_USER_ID:-dddddddddddddddddddddddd}"
QUERY_CACHE_ID="${LAB_QUERY_CACHE_ID:-eeeeeeeeeeeeeeeeeeeeeeee}"
QUERY_CACHE_VALUE_ID="${LAB_QUERY_CACHE_VALUE_ID:-ffffffffffffffffffffffff}"
STATEMENT_ID="${LAB_STATEMENT_ID:-111111111111111111111111}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
# bcrypt hash for the synthetic password LabGolden123!
USER_PASSWORD_HASH="${LAB_USER_PASSWORD_HASH:-\$2a\$10\$m5C8wR95wyFJVd7BfgH41emHEzUrbvV2XDtjrWGtm.5GLkbArSrLG}"
DB_NAME="${LAB_DB_NAME:-learninglocker_v2}"

mongo_eval "
const orgId = ObjectId('${ORG_ID}');
const lrsId = ObjectId('${LRS_ID}');
const clientId = ObjectId('${CLIENT_ID}');
const userId = ObjectId('${USER_ID}');
const queryCacheId = ObjectId('${QUERY_CACHE_ID}');
const queryCacheValueId = ObjectId('${QUERY_CACHE_VALUE_ID}');
const statementId = ObjectId('${STATEMENT_ID}');
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

dbn.users.update(
  { _id: userId },
  {
    \$set: {
      name: 'Lab Golden User',
      email: '${USER_EMAIL}',
      password: '${USER_PASSWORD_HASH}',
      organisations: [orgId],
      organisationSettings: [{
        organisation: orgId,
        scopes: ['all'],
        roles: [],
        filter: '{}'
      }],
      ownerOrganisation: orgId,
      ownerOrganisationSettings: {
        LOCKOUT_ENABLED: false,
        LOCKOUT_ATTEMPS: 5,
        LOCKOUT_SECONDS: 1800,
        PASSWORD_HISTORY_CHECK: false,
        PASSWORD_HISTORY_TOTAL: 0,
        PASSWORD_MIN_LENGTH: 8,
        PASSWORD_REQUIRE_ALPHA: true,
        PASSWORD_REQUIRE_NUMBER: true,
        PASSWORD_USE_CUSTOM_REGEX: false,
        PASSWORD_CUSTOM_REGEX: null,
        PASSWORD_CUSTOM_MESSAGE: null
      },
      scopes: ['all', 'statements/delete'],
      verified: true,
      authFailedAttempts: 0,
      authLockoutExpiry: null,
      hasBeenMigrated: true,
      updatedAt: new Date()
    },
    \$setOnInsert: {
      _id: userId,
      settings: { CONFIRM_BEFORE_DELETE: true },
      resetTokens: [],
      passwordHistory: [],
      createdAt: new Date()
    }
  },
  { upsert: true }
);

dbn.queryBuilderCaches.deleteMany({ organisation: orgId });
dbn.queryBuilderCaches.insertOne({
  _id: queryCacheId,
  organisation: orgId,
  path: ['statement', 'actor'],
  searchString: 'lab-golden',
  valueType: 'String',
  createdAt: new Date(),
  updatedAt: new Date()
});

dbn.queryBuilderCacheValues.deleteMany({ organisation: orgId });
dbn.queryBuilderCacheValues.insertOne({
  _id: queryCacheValueId,
  organisation: orgId,
  path: 'statement.actor',
  hash: 'lab-golden-hash',
  value: 'Lab Golden',
  display: null,
  valueType: 'String',
  searchString: 'lab-golden',
  createdAt: new Date(),
  updatedAt: new Date()
});

dbn.statements.deleteMany({ _id: statementId });
dbn.statements.insertOne({
  _id: statementId,
  organisation: orgId,
  lrs_id: lrsId,
  client: clientId,
  client_id: '${CLIENT_ID}',
  active: true,
  voided: false,
  timestamp: new Date('2026-01-01T00:00:00.000Z'),
  stored: new Date('2026-01-01T00:00:00.000Z'),
  hash: 'lab-golden-statement-hash',
  refs: {},
  metadata: {},
  completedQueues: [],
  processingQueues: [],
  deadForwardingQueue: [],
  failedForwardingLog: [],
  pendingForwardingQueue: [],
  completedForwardingQueue: [],
  statement: {
    id: '11111111-1111-4111-8111-111111111111',
    actor: { mbox: 'mailto:lab-golden@example.invalid', objectType: 'Agent' },
    verb: { id: 'http://adlnet.gov/expapi/verbs/experienced', display: { 'en-US': 'experienced' } },
    object: { id: 'http://example.com/activities/lab-golden', objectType: 'Activity' },
    version: '1.0.3',
    timestamp: '2026-01-01T00:00:00.000Z',
    stored: '2026-01-01T00:00:00.000Z'
  }
});

print(JSON.stringify({
  ok: true,
  organisationId: '${ORG_ID}',
  lrsId: '${LRS_ID}',
  clientId: '${CLIENT_ID}',
  userId: '${USER_ID}',
  statementId: '${STATEMENT_ID}',
  basicKey: '${BASIC_KEY}',
  userEmail: '${USER_EMAIL}'
}));
"

echo "Golden fixtures ensured"
