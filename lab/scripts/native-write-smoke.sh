#!/usr/bin/env bash
set -euo pipefail

# Smoke native / restify write parity for a simple org-scoped model (dashboard).
# Creates, updates, then deletes a dashboard under org JWT; records HTTP statuses.
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-write-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
USER_PASSWORD="${LAB_USER_PASSWORD:-LabGolden123!}"
TITLE_PREFIX="${TITLE_PREFIX:-native-write-smoke}"

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-write.json"
cd "${APP}"

USER_TOKEN="$(curl -fsS -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

title="${TITLE_PREFIX}-$(date +%s)-$$"
create_body="$(curl -sS -w '\n%{http_code}' -X POST "${API_URL}/v2/dashboard" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d "{\"title\":\"${title}\",\"organisation\":\"${ORG_ID}\"}")"
create_code="$(printf '%s' "${create_body}" | tail -n1)"
create_json="$(printf '%s' "${create_body}" | sed '$d')"
dash_id="$(printf '%s' "${create_json}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j._id||''));}catch(e){}})")"

update_code="000"
delete_code="000"
if [[ -n "${dash_id}" ]]; then
  update_code="$(curl -sS -o /dev/null -w '%{http_code}' -X PUT "${API_URL}/v2/dashboard/${dash_id}" \
    -H "Authorization: Bearer ${ORG_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{\"title\":\"${title}-updated\"}")"
  delete_code="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "${API_URL}/v2/dashboard/${dash_id}" \
    -H "Authorization: Bearer ${ORG_TOKEN}")"
fi

export HOST_LABEL REPORT
export CREATE_CODE="${create_code}"
export UPDATE_CODE="${update_code}"
export DELETE_CODE="${delete_code}"
export DASH_ID="${dash_id}"

node <<'NODE'
const fs = require('fs');
const createStatus = Number(process.env.CREATE_CODE);
const updateStatus = Number(process.env.UPDATE_CODE);
const deleteStatus = Number(process.env.DELETE_CODE);
const report = {
  host: process.env.HOST_LABEL,
  path: '/v2/dashboard',
  createStatus,
  updateStatus,
  deleteStatus,
  id: process.env.DASH_ID || null,
  ok: createStatus === 201 && updateStatus === 200 && deleteStatus === 204,
};
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_WRITE_SMOKE_OK' : 'NATIVE_WRITE_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
