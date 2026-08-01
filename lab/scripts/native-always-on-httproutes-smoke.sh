#!/usr/bin/env bash
set -euo pipefail

# Smoke remaining always-on HttpRoutes (ADR 0022) — health, auth shape, metadata.
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-always-on-httproutes-smoke.sh

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
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-always-on-httproutes.json"
cd "${APP}"

bash lab/scripts/ensure-golden-fixtures.sh >/dev/null

USER_TOKEN="$(curl -fsS --max-time 30 -X POST -u "${USER_EMAIL}:${USER_PASSWORD}" \
  "${API_URL}/auth/jwt/password")"
ORG_TOKEN="$(curl -fsS --max-time 30 -X POST \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data "{\"organisation\":\"${ORG_ID}\"}" \
  "${API_URL}/auth/jwt/organisation")"

probe() {
  local name="$1"
  local method="$2"
  local url="$3"
  shift 3
  local body
  body="$(mktemp)"
  local code
  code="$(curl -sS --max-time 30 -o "${body}" -w '%{http_code}' \
    -X "${method}" "$@" "${url}" || echo 000)"
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

health="$(probe health GET "${API_URL}/")"
version="$(probe version GET "${API_URL}/app/version")"
logo_unauth="$(probe downloadlogoUnauth GET "${API_URL}/downloadlogo/${ORG_ID}")"
logo="$(probe downloadlogo GET "${API_URL}/downloadlogo/${ORG_ID}" \
  -H "Authorization: Bearer ${ORG_TOKEN}")"
# statement edit requires xapi write scopes — use golden client basic
meta_unauth="$(probe statementMetadataUnauth POST \
  "${API_URL}/v2/statementmetadata/${STATEMENT_ID}" \
  -H 'Content-Type: application/json' --data '{}')"
meta="$(probe statementMetadata POST \
  "${API_URL}/v2/statementmetadata/${STATEMENT_ID}" \
  -u "${BASIC_KEY}:${BASIC_SECRET}" \
  -H 'Content-Type: application/json' --data '{}')"

export HOST_LABEL REPORT
export HEALTH="${health}" VERSION="${version}"
export LOGO_UNAUTH="${logo_unauth}" LOGO="${logo}"
export META_UNAUTH="${meta_unauth}" META="${meta}"

node <<'NODE'
const fs = require('fs');
const paths = {
  health: JSON.parse(process.env.HEALTH),
  version: JSON.parse(process.env.VERSION),
  downloadlogoUnauth: JSON.parse(process.env.LOGO_UNAUTH),
  downloadlogo: JSON.parse(process.env.LOGO),
  statementMetadataUnauth: JSON.parse(process.env.META_UNAUTH),
  statementMetadata: JSON.parse(process.env.META),
};
const report = { host: process.env.HOST_LABEL, paths };
report.ok =
  paths.health.status === 200 &&
  paths.version.status === 200 &&
  paths.downloadlogoUnauth.status === 401 &&
  [200, 404].includes(paths.downloadlogo.status) &&
  paths.statementMetadataUnauth.status === 401 &&
  paths.statementMetadata.status === 200 &&
  Boolean(paths.statementMetadata.hash);
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_ALWAYS_ON_HTTP_SMOKE_OK' : 'NATIVE_ALWAYS_ON_HTTP_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
