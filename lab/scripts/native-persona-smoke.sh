#!/usr/bin/env bash
set -euo pipefail

# Smoke Persona / PersonaIdentifier GETs (always-on dedicated routers, ADR 0021).
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-persona-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
ORG_ID="${LAB_ORG_ID:-aaaaaaaaaaaaaaaaaaaaaaaa}"
PERSONA_ID="${LAB_PERSONA_ID:-222222222222222222222222}"
PERSONA_IDENTIFIER_ID="${LAB_PERSONA_IDENTIFIER_ID:-333333333333333333333333}"
USER_EMAIL="${LAB_USER_EMAIL:-lab-golden@example.invalid}"
USER_PASSWORD="${LAB_USER_PASSWORD:-LabGolden123!}"

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-persona.json"
cd "${APP}"

bash lab/scripts/ensure-persona-collections.sh >/dev/null
bash lab/scripts/ensure-golden-fixtures.sh >/dev/null

USER_TOKEN="$(curl -fsS -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

probe() {
  local name="$1"
  local url="$2"
  local body
  body="$(mktemp)"
  local code
  code="$(curl -sS --max-time 30 -o "${body}" -w '%{http_code}' \
    -H "Authorization: Bearer ${ORG_TOKEN}" "${url}")"
  local meta
  meta="$(node lab/scripts/canonical-json-report.js "${body}")"
  rm -f "${body}"
  node -e "
    const m = JSON.parse(process.argv[1]);
    process.stdout.write(JSON.stringify({
      name: process.argv[2],
      status: Number(process.argv[3]),
      kind: m.kind,
      count: m.count,
      hash: m.hash,
    }));
  " "${meta}" "${name}" "${code}"
}

persona_list="$(probe persona "${API_URL}/v2/persona")"
persona_by_id="$(probe personaById "${API_URL}/v2/persona/${PERSONA_ID}")"
persona_count="$(probe personaCount "${API_URL}/v2/persona/count")"
persona_conn="$(probe personaConnection "${API_URL}/connection/persona?first=5")"
ident_list="$(probe personaIdentifier "${API_URL}/v2/personaIdentifier")"
ident_by_id="$(probe personaIdentifierById "${API_URL}/v2/personaIdentifier/${PERSONA_IDENTIFIER_ID}")"
ident_count="$(probe personaIdentifierCount "${API_URL}/v2/personaIdentifier/count")"
ident_conn="$(probe personaIdentifierConnection "${API_URL}/connection/personaidentifier?first=5")"

export HOST_LABEL REPORT
export PERSONA_LIST="${persona_list}"
export PERSONA_BY_ID="${persona_by_id}"
export PERSONA_COUNT="${persona_count}"
export PERSONA_CONN="${persona_conn}"
export IDENT_LIST="${ident_list}"
export IDENT_BY_ID="${ident_by_id}"
export IDENT_COUNT="${ident_count}"
export IDENT_CONN="${ident_conn}"

node <<'NODE'
const fs = require('fs');
const paths = {
  persona: JSON.parse(process.env.PERSONA_LIST),
  personaById: JSON.parse(process.env.PERSONA_BY_ID),
  personaCount: JSON.parse(process.env.PERSONA_COUNT),
  personaConnection: JSON.parse(process.env.PERSONA_CONN),
  personaIdentifier: JSON.parse(process.env.IDENT_LIST),
  personaIdentifierById: JSON.parse(process.env.IDENT_BY_ID),
  personaIdentifierCount: JSON.parse(process.env.IDENT_COUNT),
  personaIdentifierConnection: JSON.parse(process.env.IDENT_CONN),
};
const report = { host: process.env.HOST_LABEL, paths };
report.ok = Object.values(paths).every((p) => p.status === 200 && p.hash);
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_PERSONA_SMOKE_OK' : 'NATIVE_PERSONA_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
