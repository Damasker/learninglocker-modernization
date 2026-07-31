#!/usr/bin/env bash
set -euo pipefail

# Smoke User create/update/delete under org JWT (native vs restify).
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-user-write-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
USER_PASSWORD="${LAB_USER_PASSWORD:-LabGolden123!}"

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-user-write.json"
cd "${APP}"

USER_TOKEN="$(curl -fsS -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

email="lab-user-write-$(date +%s)-$$@example.invalid"
create_body="$(curl -sS -w '\n%{http_code}' -X POST "${API_URL}/v2/user" \
  -H "Authorization: Bearer ${ORG_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"Lab User Write\",\"email\":\"${email}\",\"organisations\":[\"${ORG_ID}\"]}")"
create_code="$(printf '%s' "${create_body}" | tail -n1)"
create_json="$(printf '%s' "${create_body}" | sed '$d')"
user_id="$(printf '%s' "${create_json}" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);process.stdout.write(String(j._id||''));}catch(e){}})")"

update_code="000"
delete_code="000"
if [[ -n "${user_id}" ]]; then
  update_code="$(curl -sS -o /dev/null -w '%{http_code}' -X PUT "${API_URL}/v2/user/${user_id}" \
    -H "Authorization: Bearer ${ORG_TOKEN}" \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"Lab User Write Updated\"}")"
  delete_code="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE "${API_URL}/v2/user/${user_id}" \
    -H "Authorization: Bearer ${ORG_TOKEN}")"
fi

export HOST_LABEL REPORT
export CREATE_CODE="${create_code}"
export UPDATE_CODE="${update_code}"
export DELETE_CODE="${delete_code}"
export SMOKE_USER_ID="${user_id}"

node <<'NODE'
const fs = require('fs');
const createStatus = Number(process.env.CREATE_CODE);
const updateStatus = Number(process.env.UPDATE_CODE);
const deleteStatus = Number(process.env.DELETE_CODE);
const report = {
  host: process.env.HOST_LABEL,
  path: '/v2/user',
  createStatus,
  updateStatus,
  deleteStatus,
  id: process.env.SMOKE_USER_ID || null,
  ok: createStatus === 201 && updateStatus === 200 && deleteStatus === 204,
};
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_USER_WRITE_SMOKE_OK' : 'NATIVE_USER_WRITE_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
