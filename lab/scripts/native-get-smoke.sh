#!/usr/bin/env bash
set -euo pipefail

# Smoke /v2 GET list endpoints with lab golden client basic auth.
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-get-smoke.sh
#   NATIVE_MODE=on|off (recorded in report only; caller toggles env)

API_URL="${API_URL:-http://127.0.0.1:8080}"
HOST_LABEL="${HOST_LABEL:-$(hostname)}"
NATIVE_MODE="${NATIVE_MODE:-unknown}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
REPORT_DIR="${REPORT_DIR:-/opt/learninglocker/app/lab/reports}"
AUTH_HEADER="Authorization: Basic $(printf '%s' "${BASIC_KEY}:${BASIC_SECRET}" | base64 -w0 2>/dev/null || printf '%s' "${BASIC_KEY}:${BASIC_SECRET}" | base64)"

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
)

mkdir -p "${REPORT_DIR}"
STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
RESULTS='['
FIRST=1

echo "== Native GET smoke on ${HOST_LABEL} (native=${NATIVE_MODE}) =="

for path in "${PATHS[@]}"; do
  body_file="$(mktemp)"
  code="$(curl -sS -o "${body_file}" -w '%{http_code}' \
    -H "${AUTH_HEADER}" \
    -H 'Accept: application/json' \
    "${API_URL}${path}" || echo '000')"
  bytes="$(wc -c < "${body_file}" | tr -d ' ')"
  # Classify payload without dumping secrets/PII.
  kind='other'
  if head -c 1 "${body_file}" | grep -q '\['; then
    kind='array'
  elif head -c 1 "${body_file}" | grep -q '{'; then
    kind='object'
  elif [[ "${bytes}" == "0" ]]; then
    kind='empty'
  fi
  echo "${path} HTTP ${code} (${kind}, ${bytes}b)"
  if [[ "${FIRST}" == "1" ]]; then
    FIRST=0
  else
    RESULTS+=','
  fi
  RESULTS+="$(printf '{"path":"%s","status":%s,"kind":"%s","bytes":%s}' \
    "${path}" "${code}" "${kind}" "${bytes}")"
  rm -f "${body_file}"
done

RESULTS+=']'
FINISHED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
REPORT_FILE="${REPORT_DIR}/native-get-${HOST_LABEL}-${NATIVE_MODE}-$(date -u +%Y%m%dT%H%M%SZ).json"
cat > "${REPORT_FILE}" <<EOF
{
  "host": "${HOST_LABEL}",
  "nativeMode": "${NATIVE_MODE}",
  "startedAt": "${STARTED_AT}",
  "finishedAt": "${FINISHED_AT}",
  "apiRoot": "${API_URL}",
  "results": ${RESULTS}
}
EOF

echo "Report: ${REPORT_FILE}"
echo "NATIVE_GET_SMOKE_OK"
