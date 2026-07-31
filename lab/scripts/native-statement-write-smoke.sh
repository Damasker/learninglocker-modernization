#!/usr/bin/env bash
set -euo pipefail

# Smoke Statement/BatchDelete write verbs (scope-then-405 / gated delete).
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-statement-write-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
STATEMENT_ID="${LAB_STATEMENT_ID:-111111111111111111111111}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
USER_PASSWORD="${LAB_USER_PASSWORD:-LabGolden123!}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-statement-write.json"
cd "${APP}"

# Re-seed fixtures so Statement DELETE does not leave a missing id for later runs.
bash lab/scripts/ensure-golden-fixtures.sh >/dev/null

USER_TOKEN="$(curl -fsS -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

stmt_create="$(curl -sS -o /dev/null -w '%{http_code}' -X POST "${API_URL}/v2/statement" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{}')"
stmt_put="$(curl -sS -o /dev/null -w '%{http_code}' -X PUT "${API_URL}/v2/statement/${STATEMENT_ID}" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{}')"
stmt_delete="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "${API_URL}/v2/statement/${STATEMENT_ID}" \
  -H "Authorization: Bearer ${ORG_TOKEN}")"

bd_create="$(curl -sS -o /dev/null -w '%{http_code}' -X POST "${API_URL}/v2/batchdelete" \
  -u "${BASIC_KEY}:${BASIC_SECRET}" \
  -H 'Content-Type: application/json' \
  -d '{}')"
bd_put="$(curl -sS -o /dev/null -w '%{http_code}' -X PUT "${API_URL}/v2/batchdelete/${STATEMENT_ID}" \
  -u "${BASIC_KEY}:${BASIC_SECRET}" \
  -H 'Content-Type: application/json' \
  -d '{}')"
bd_delete="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "${API_URL}/v2/batchdelete/${STATEMENT_ID}" \
  -u "${BASIC_KEY}:${BASIC_SECRET}")"

export HOST_LABEL REPORT
export STMT_CREATE="${stmt_create}"
export STMT_PUT="${stmt_put}"
export STMT_DELETE="${stmt_delete}"
export BD_CREATE="${bd_create}"
export BD_PUT="${bd_put}"
export BD_DELETE="${bd_delete}"

node <<'NODE'
const fs = require('fs');
const n = (k) => Number(process.env[k]);
const report = {
  host: process.env.HOST_LABEL,
  statement: {
    createStatus: n('STMT_CREATE'),
    putStatus: n('STMT_PUT'),
    deleteStatus: n('STMT_DELETE'),
  },
  batchDelete: {
    createStatus: n('BD_CREATE'),
    putStatus: n('BD_PUT'),
    deleteStatus: n('BD_DELETE'),
  },
};
// Restify runs getScopeFilter before 405. Org JWT without statements/write → 403 on
// statement create/put. Client basic without statements/delete → 403 on batchdelete CUD.
// Statement DELETE may be 403 (no delete scope), 405 (deletion disabled), or 204 (allowed).
const stmtWriteOk = [403, 405].includes(report.statement.createStatus)
  && report.statement.createStatus === report.statement.putStatus;
const stmtDeleteOk = [403, 405, 204].includes(report.statement.deleteStatus);
const bdOk = [403, 405].includes(report.batchDelete.createStatus)
  && report.batchDelete.createStatus === report.batchDelete.putStatus
  && report.batchDelete.createStatus === report.batchDelete.deleteStatus;
report.ok = stmtWriteOk && stmtDeleteOk && bdOk;
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_STATEMENT_WRITE_SMOKE_OK' : 'NATIVE_STATEMENT_WRITE_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
