#!/usr/bin/env bash
set -euo pipefail

# Dual-run Statement/BatchDelete write + specialised POST smoke.
# Usage (from workstation with SSH aliases ll-legacy / ll-modern):
#   BRANCH=feat/... bash lab/scripts/dual-run-native-statement-write.sh

BRANCH="${BRANCH:-master}"
LEGACY_HOST="${LEGACY_HOST:-ll-legacy}"
MODERN_HOST="${MODERN_HOST:-ll-modern}"
KEEP_MODERN_NATIVE_ON="${KEEP_MODERN_NATIVE_ON:-1}"
SKIP_BUILD="${SKIP_BUILD:-0}"
SKIP_SYNC="${SKIP_SYNC:-0}"

run_remote() {
  local host="$1"
  local stack="$2"
  local label="$3"
  local mode="$4"

  ssh -o BatchMode=yes "${host}" bash -s <<EOF
set -euo pipefail
cd /opt/learninglocker/app
if [[ "${SKIP_SYNC}" != "1" ]]; then
  BRANCH='${BRANCH}' bash lab/scripts/sync-app-branch.sh
fi
if [[ "${SKIP_BUILD}" != "1" ]]; then
  STACK='${stack}' bash lab/scripts/build-core.sh
fi
STACK='${stack}' bash lab/scripts/start-core.sh || true
MODE='${mode}' bash lab/scripts/set-native-get-flags.sh
bash lab/scripts/ensure-golden-fixtures.sh
HOST_LABEL='${label}' bash lab/scripts/native-statement-write-smoke.sh
EOF
}

run_remote "${LEGACY_HOST}" legacy ll-legacy off
run_remote "${MODERN_HOST}" modern ll-modern on

mkdir -p lab/reports
scp -o BatchMode=yes \
  "${LEGACY_HOST}:/opt/learninglocker/app/lab/reports/ll-legacy-native-statement-write.json" \
  lab/reports/ || true
scp -o BatchMode=yes \
  "${MODERN_HOST}:/opt/learninglocker/app/lab/reports/ll-modern-native-statement-write.json" \
  lab/reports/ || true

node <<'NODE'
const fs = require('fs');
const legacy = JSON.parse(fs.readFileSync('lab/reports/ll-legacy-native-statement-write.json', 'utf8'));
const modern = JSON.parse(fs.readFileSync('lab/reports/ll-modern-native-statement-write.json', 'utf8'));
const keys = [
  ['statement', 'createStatus'],
  ['statement', 'putStatus'],
  ['statement', 'deleteStatus'],
  ['batchDelete', 'createStatus'],
  ['batchDelete', 'putStatus'],
  ['batchDelete', 'deleteStatus'],
  ['batchDelete', 'initialiseStatus'],
  ['batchDelete', 'terminateStatus'],
  ['batchDelete', 'terminateAllStatus'],
  ['batchDelete', 'initialiseEmptyStatus'],
];
const get = (o, [a, b]) => o[a][b];
const mismatches = keys.filter((k) => get(legacy, k) !== get(modern, k)).map((k) => k.join('.'));
if (mismatches.length || !legacy.ok || !modern.ok) {
  console.error('NATIVE_STATEMENT_WRITE_COMPARE_FAIL', { legacy, modern, mismatches });
  process.exit(1);
}
console.log('NATIVE_STATEMENT_WRITE_COMPARE_OK', {
  statement: legacy.statement,
  batchDelete: legacy.batchDelete,
});
NODE

if [[ "${KEEP_MODERN_NATIVE_ON}" == "1" ]]; then
  ssh -o BatchMode=yes "${MODERN_HOST}" \
    'cd /opt/learninglocker/app && MODE=on bash lab/scripts/set-native-get-flags.sh'
fi
