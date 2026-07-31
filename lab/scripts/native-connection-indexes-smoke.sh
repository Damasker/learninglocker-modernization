#!/usr/bin/env bash
set -euo pipefail

# Smoke GET /connection/:model and /indexes/:model for fixture-backed models.
# Usage:
#   HOST_LABEL=ll-modern bash lab/scripts/native-connection-indexes-smoke.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
REPORT_DIR="${REPORT_DIR:-${APP}/lab/reports}"
HOST_LABEL="${HOST_LABEL:-$(hostname -s 2>/dev/null || hostname)}"
API_URL="${API_URL:-http://127.0.0.1:8080}"
BASIC_KEY="${LAB_BASIC_KEY:-lab_golden_key_00000000000000000001}"
BASIC_SECRET="${LAB_BASIC_SECRET:-lab_golden_secret_000000000000000001}"
MODELS=(organisation lrs client statement querybuildercache)

mkdir -p "${REPORT_DIR}"
REPORT="${REPORT_DIR}/${HOST_LABEL}-native-connection-indexes.json"
cd "${APP}"

bash lab/scripts/ensure-golden-fixtures.sh >/dev/null

probe() {
  local name="$1"
  local url="$2"
  local body
  body="$(mktemp)"
  local code
  code="$(curl -sS -o "${body}" -w '%{http_code}' -u "${BASIC_KEY}:${BASIC_SECRET}" "${url}")"
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

paths_json='{}'
for model in "${MODELS[@]}"; do
  conn="$(probe "connection/${model}" "${API_URL}/connection/${model}?first=5")"
  idx="$(probe "indexes/${model}" "${API_URL}/indexes/${model}")"
  paths_json="$(node -e "
    const paths = JSON.parse(process.argv[1]);
    paths[process.argv[2]] = JSON.parse(process.argv[3]);
    paths[process.argv[4]] = JSON.parse(process.argv[5]);
    process.stdout.write(JSON.stringify(paths));
  " "${paths_json}" "connection/${model}" "${conn}" "indexes/${model}" "${idx}")"
done

export HOST_LABEL REPORT PATHS_JSON="${paths_json}"
node <<'NODE'
const fs = require('fs');
const paths = JSON.parse(process.env.PATHS_JSON);
const report = { host: process.env.HOST_LABEL, paths };
report.ok = Object.values(paths).every((p) => [200, 403].includes(p.status) && p.hash);
fs.writeFileSync(process.env.REPORT, JSON.stringify(report, null, 2));
console.log(report.ok ? 'NATIVE_CONNECTION_INDEXES_SMOKE_OK' : 'NATIVE_CONNECTION_INDEXES_SMOKE_FAIL');
console.log(JSON.stringify(report));
process.exit(report.ok ? 0 : 1);
NODE
