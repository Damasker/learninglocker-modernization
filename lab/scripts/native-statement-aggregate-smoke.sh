#!/usr/bin/env bash
set -euo pipefail

# Smoke statement analytics GETs (aggregate / async / count / v1).
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-statement-aggregate-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
PIPELINE='[{"$match":{"statement.id":"11111111-1111-4111-8111-111111111111"}},{"$project":{"_id":1,"statement.id":1}}]'
COUNT_FILTER='{"statement.id":"11111111-1111-4111-8111-111111111111"}'

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-statement-aggregate.json"
cd "${APP}"

bash lab/scripts/ensure-golden-fixtures.sh >/dev/null

hash_body() {
  local path="$1"
  node lab/scripts/canonical-json-report.js "${path}"
}

probe() {
  local name="$1"
  local url="$2"
  shift 2
  local body
  body="$(mktemp)"
  local code
  code="$(curl -sS -o "${body}" -w '%{http_code}' -u "${BASIC_KEY}:${BASIC_SECRET}" "$@" "${url}")"
  local meta
  meta="$(hash_body "${body}")"
  rm -f "${body}"
  node -e "
    const m = JSON.parse(process.argv[1]);
    const out = {
      name: process.argv[2],
      status: Number(process.argv[3]),
      kind: m.kind,
      count: m.count,
      hash: m.hash,
    };
    process.stdout.write(JSON.stringify(out));
  " "${meta}" "${name}" "${code}"
}

agg="$(probe aggregate -G "${API_URL}/statements/aggregate" --data-urlencode "pipeline=${PIPELINE}")"
async="$(probe aggregateAsync -G "${API_URL}/statements/aggregateAsync" --data-urlencode "pipeline=${PIPELINE}")"
count="$(probe count -G "${API_URL}/statements/count" --data-urlencode "filter=${COUNT_FILTER}")"
v1="$(probe v1aggregate -G "${API_URL}/v1/statements/aggregate" --data-urlencode "pipeline=${PIPELINE}")"

export HOST_LABEL REPORT AGG="${agg}" ASYNC="${async}" COUNT="${count}" V1="${v1}"
node <<'NODE'
const fs = require('fs');
const paths = {
  aggregate: JSON.parse(process.env.AGG),
  aggregateAsync: JSON.parse(process.env.ASYNC),
  count: JSON.parse(process.env.COUNT),
  v1aggregate: JSON.parse(process.env.V1),
};
const report = { host: process.env.HOST_LABEL, paths };
report.ok = Object.values(paths).every((p) => p.status === 200 && p.hash);
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_STATEMENT_AGGREGATE_SMOKE_OK' : 'NATIVE_STATEMENT_AGGREGATE_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
