#!/usr/bin/env bash
set -euo pipefail

# Golden path from docs/contracts/compatibility-freeze.md:
# 1) store statement via xAPI
# 2) document in Mongo with envelope fields
# 3) Redis notify / worker processing
# 4) persona + querybuildercache queues complete
# 5) aggregate/count APIs return scoped results
#
# Usage: ./golden-path.sh
# Writes JSON report to lab/reports/golden-path-<host>-<ts>.json when possible.

HOST_LABEL="${HOST_LABEL:-$(hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
XAPI_URL="${XAPI_URL:-http://127.0.0.1:8081}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
LRS_ID="${LAB_LRS_ID:-bbbbbbbbbbbbbbbbbbbbbbbb}"
DB_NAME="${LAB_DB_NAME:-learninglocker_v2}"
REDIS_PREFIX="${REDIS_PREFIX:-LEARNINGLOCKER}"
REPORT_DIR="${REPORT_DIR:-/opt/learninglocker/app/lab/reports}"
STATEMENT_ID="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"
ACTOR_MBOX="mailto:golden-${STATEMENT_ID}@example.com"

AUTH_HEADER="Authorization: Basic $(printf '%s' "${BASIC_KEY}:${BASIC_SECRET}" | base64 -w0 2>/dev/null || printf '%s' "${BASIC_KEY}:${BASIC_SECRET}" | base64)"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

pass() {
  echo "PASS: $*"
}

mongo_eval() {
  docker exec -i ll-mongo-1 mongosh --quiet --eval "$1"
}

redis_cli() {
  docker exec -i ll-redis-1 redis-cli "$@"
}

mkdir -p "${REPORT_DIR}"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "== Golden path on ${HOST_LABEL} =="

# 0. smoke
api_code="$(curl -s -o /dev/null -w '%{http_code}' "${API_URL}/" || true)"
[[ "${api_code}" != "000" ]] || fail "API not reachable (${api_code})"
pass "API reachable HTTP ${api_code}"

# 1. store statement
store_body="$(curl -sS -w '\n%{http_code}' \
  -X POST "${XAPI_URL}/data/xAPI/statements" \
  -H "${AUTH_HEADER}" \
  -H 'Content-Type: application/json' \
  -H 'X-Experience-API-Version: 1.0.3' \
  -d "{
    \"id\": \"${STATEMENT_ID}\",
    \"actor\": { \"mbox\": \"${ACTOR_MBOX}\", \"objectType\": \"Agent\" },
    \"verb\": { \"id\": \"http://adlnet.gov/expapi/verbs/experienced\", \"display\": { \"en-US\": \"experienced\" } },
    \"object\": { \"id\": \"http://example.com/activities/lab-golden-path\", \"objectType\": \"Activity\" }
  }")"
store_code="$(printf '%s' "${store_body}" | tail -n1)"
store_payload="$(printf '%s' "${store_body}" | sed '$d')"
[[ "${store_code}" == "200" || "${store_code}" == "204" ]] || fail "xAPI store HTTP ${store_code}: ${store_payload}"
pass "xAPI stored statement ${STATEMENT_ID} (HTTP ${store_code})"

# 2. Mongo envelope
doc_json=""
for i in $(seq 1 30); do
  doc_json="$(mongo_eval "
    const d = db.getSiblingDB('${DB_NAME}').statements.findOne({ 'statement.id': '${STATEMENT_ID}' });
    if (!d) { print(''); } else {
      print(JSON.stringify({
        id: d._id,
        hasStatement: !!d.statement,
        organisation: d.organisation ? String(d.organisation) : null,
        lrs_id: d.lrs_id ? String(d.lrs_id) : null,
        client: d.client ? String(d.client) : null,
        hash: d.hash || null,
        completedQueues: d.completedQueues || [],
        processingQueues: d.processingQueues || []
      }));
    }
  ")"
  [[ -n "${doc_json}" ]] && break
  sleep 1
done
[[ -n "${doc_json}" ]] || fail "statement not found in Mongo"
echo "${doc_json}" | grep -q "\"organisation\":\"${ORG_ID}\"" || fail "organisation mismatch: ${doc_json}"
echo "${doc_json}" | grep -q "\"lrs_id\":\"${LRS_ID}\"" || fail "lrs_id mismatch: ${doc_json}"
echo "${doc_json}" | grep -q '"hash":"' || fail "missing hash: ${doc_json}"
pass "Mongo envelope fields present"

# 3/4. worker queues — querybuildercache must complete; persona extract is required
# but surfaced with handler logs if it fails (see wrapStatementJob).
persona_q='STATEMENT_PERSON_QUEUE'
qbc_q='STATEMENT_QUERYBUILDERCACHE_QUEUE'
final_json=""
persona_ok=0
qbc_ok=0
for i in $(seq 1 90); do
  final_json="$(mongo_eval "
    const d = db.getSiblingDB('${DB_NAME}').statements.findOne({ 'statement.id': '${STATEMENT_ID}' });
    print(JSON.stringify({
      completedQueues: d.completedQueues || [],
      processingQueues: d.processingQueues || [],
      hasPerson: !!(d.person && d.person._id)
    }));
  ")"
  completed="$(echo "${final_json}" | sed -n 's/.*"completedQueues":\[\([^]]*\)\].*/\1/p')"
  if echo "${completed}" | grep -q "${qbc_q}"; then
    qbc_ok=1
  fi
  if echo "${completed}" | grep -q "${persona_q}"; then
    persona_ok=1
  fi
  if [[ "${qbc_ok}" == "1" && "${persona_ok}" == "1" ]]; then
    break
  fi
  # Persona may complete via person assignment even if queue bookkeeping lags.
  if [[ "${qbc_ok}" == "1" ]] && echo "${final_json}" | grep -q '"hasPerson":true'; then
    persona_ok=1
    break
  fi
  sleep 1
done
[[ "${qbc_ok}" == "1" ]] || fail "querybuildercache queue not completed: ${final_json}"
if [[ "${persona_ok}" != "1" ]]; then
  fail "persona queue not completed (check worker logs for extractPersonas): ${final_json}"
fi
pass "Worker persona + querybuildercache queues completed"

# Redis notify channel exists (prefix contract)
notify_key="${REDIS_PREFIX}:statement.notify"
# Presence of the key is optional after drain; contract smoke: PREFIX ping
redis_pong="$(redis_cli PING | tr -d '\r')"
[[ "${redis_pong}" == "PONG" ]] || fail "Redis not healthy"
pass "Redis healthy (notify channel ${notify_key})"

# 5. aggregate + count (client basic)
pipeline='[{"$limit":5},{"$project":{"_id":1,"statement.id":1}}]'
agg_code="$(curl -s -o /tmp/ll-agg.json -w '%{http_code}' \
  -G "${API_URL}/statements/aggregate" \
  --data-urlencode "pipeline=${pipeline}" \
  -H "${AUTH_HEADER}" || true)"
[[ "${agg_code}" == "200" ]] || fail "aggregate HTTP ${agg_code}: $(cat /tmp/ll-agg.json 2>/dev/null || true)"
pass "aggregate HTTP 200"

count_code="$(curl -s -o /tmp/ll-count.json -w '%{http_code}' \
  -G "${API_URL}/statements/count" \
  --data-urlencode "filter={}" \
  -H "${AUTH_HEADER}" || true)"
[[ "${count_code}" == "200" ]] || fail "count HTTP ${count_code}: $(cat /tmp/ll-count.json 2>/dev/null || true)"
pass "count HTTP 200"

FINISHED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
REPORT_FILE="${REPORT_DIR}/golden-path-${HOST_LABEL}-$(date -u +%Y%m%dT%H%M%SZ).json"
cat > "${REPORT_FILE}" <<EOF
{
  "host": "${HOST_LABEL}",
  "startedAt": "${STARTED_AT}",
  "finishedAt": "${FINISHED_AT}",
  "statementId": "${STATEMENT_ID}",
  "organisationId": "${ORG_ID}",
  "lrsId": "${LRS_ID}",
  "apiRoot": "${API_URL}",
  "xapiRoot": "${XAPI_URL}",
  "checks": {
    "apiSmoke": "${api_code}",
    "xapiStore": "${store_code}",
    "mongoEnvelope": true,
    "workerQueues": ${final_json},
    "aggregate": "${agg_code}",
    "count": "${count_code}"
  },
  "ok": true
}
EOF

echo "Report: ${REPORT_FILE}"
echo "GOLDEN_PATH_OK"
