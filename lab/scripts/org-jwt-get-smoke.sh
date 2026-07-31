#!/usr/bin/env bash
set -euo pipefail

# Smoke scoped /v2 GET lists with a synthetic organisation-admin JWT.

API_URL="${API_URL:-http://127.0.0.1:8080}"
HOST_LABEL="${HOST_LABEL:-$(hostname)}"
NATIVE_MODE="${NATIVE_MODE:-unknown}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
USER_ID="${LAB_USER_ID:-dddddddddddddddddddddddd}"
STATEMENT_ID="${LAB_STATEMENT_ID:-111111111111111111111111}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
USER_PASSWORD="${LAB_USER_PASSWORD:-LabGolden123!}"
REPORT_DIR="${REPORT_DIR:-/opt/learninglocker/app/lab/reports}"

USER_TOKEN="$(curl -fsS -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

PATHS=(
  /v2/client
  /v2/lrs
  /v2/organisation
  /v2/role
  /v2/user
  /v2/dashboard
  /v2/visualisation
  /v2/query
  /v2/export
  /v2/download
  /v2/personaattribute
  /v2/personasimport
  /v2/personasimporttemplate
  /v2/importcsv
  /v2/sitesettings
  /v2/stream
  /v2/batchdelete
  /v2/statementforwarding
  /v2/querybuildercache
  /v2/querybuildercachevalue
  /v2/statement
)

mkdir -p "${REPORT_DIR}"
started_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
results='['
first=1

echo "== Organisation JWT GET smoke on ${HOST_LABEL} (native=${NATIVE_MODE}) =="

for path in "${PATHS[@]}"; do
  body_file="$(mktemp)"
  filter="{\"organisation\":\"${ORG_ID}\"}"
  if [[ "${path}" == "/v2/organisation" ]]; then
    filter="{\"_id\":\"${ORG_ID}\"}"
  elif [[ "${path}" == "/v2/user" ]]; then
    filter="{\"_id\":\"${USER_ID}\"}"
  elif [[ "${path}" == "/v2/statement" ]]; then
    filter="{\"_id\":\"${STATEMENT_ID}\"}"
  elif [[ "${path}" == "/v2/sitesettings" ]]; then
    filter='{}'
  fi

  code="$(curl -sS -o "${body_file}" -w '%{http_code}' -G \
    -H "Authorization: Bearer ${ORG_TOKEN}" \
    -H 'Accept: application/json' \
    --data-urlencode "query=${filter}" \
    --data-urlencode "filter=${filter}" \
    "${API_URL}${path}" || echo '000')"
  body_report="$(node lab/scripts/canonical-json-report.js "${body_file}")"

  echo "${path} HTTP ${code} ${body_report}"
  if [[ "${first}" == "1" ]]; then
    first=0
  else
    results+=','
  fi
  results+="$(node -e '
    const body = JSON.parse(process.argv[3]);
    process.stdout.write(JSON.stringify({
      path: process.argv[1],
      status: Number(process.argv[2]),
      ...body,
    }));
  ' "${path}" "${code}" "${body_report}")"
  rm -f "${body_file}"
done

results+=']'
report_file="${REPORT_DIR}/org-jwt-get-${HOST_LABEL}-${NATIVE_MODE}-$(date -u +%Y%m%dT%H%M%SZ).json"
node -e '
  const fs = require("fs");
  fs.writeFileSync(process.argv[1], `${JSON.stringify({
    host: process.argv[2],
    nativeMode: process.argv[3],
    startedAt: process.argv[4],
    finishedAt: new Date().toISOString(),
    results: JSON.parse(process.argv[5]),
  }, null, 2)}\n`);
' "${report_file}" "${HOST_LABEL}" "${NATIVE_MODE}" "${started_at}" "${results}"

echo "Report: ${report_file}"
