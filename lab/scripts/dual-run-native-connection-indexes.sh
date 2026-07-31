#!/usr/bin/env bash
set -euo pipefail

# Dual-run connection/indexes: legacy flag-off vs modern flag-on.
# Usage:
#   BRANCH=feat/... bash lab/scripts/dual-run-native-connection-indexes.sh

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

  ssh -o BatchMode=yes "${host}" "cd /opt/learninglocker/app && \
    if [ '${SKIP_SYNC}' != '1' ]; then BRANCH='${BRANCH}' bash lab/scripts/sync-app-branch.sh; fi && \
    if [ '${SKIP_BUILD}' != '1' ]; then STACK='${stack}' bash lab/scripts/build-core.sh; fi && \
    STACK='${stack}' bash lab/scripts/start-core.sh || true && \
    MODE='${mode}' bash lab/scripts/set-native-get-flags.sh && \
    bash lab/scripts/ensure-golden-fixtures.sh && \
    HOST_LABEL='${label}' bash lab/scripts/native-connection-indexes-smoke.sh"
}

run_remote "${LEGACY_HOST}" legacy ll-legacy off
run_remote "${MODERN_HOST}" modern ll-modern on

mkdir -p lab/reports
scp -o BatchMode=yes \
  "${LEGACY_HOST}:/opt/learninglocker/app/lab/reports/ll-legacy-native-connection-indexes.json" \
  lab/reports/
scp -o BatchMode=yes \
  "${MODERN_HOST}:/opt/learninglocker/app/lab/reports/ll-modern-native-connection-indexes.json" \
  lab/reports/

node <<'NODE'
const fs = require('fs');
const legacy = JSON.parse(fs.readFileSync('lab/reports/ll-legacy-native-connection-indexes.json', 'utf8'));
const modern = JSON.parse(fs.readFileSync('lab/reports/ll-modern-native-connection-indexes.json', 'utf8'));
const names = Object.keys(legacy.paths).sort();
const mismatches = [];
for (const name of names) {
  const l = legacy.paths[name];
  const m = modern.paths[name];
  if (!m) {
    mismatches.push(`${name}.missing`);
    continue;
  }
  if (l.status !== m.status) mismatches.push(`${name}.status`);
  // Indexes metadata is stable across hosts; connection edge pages and 403
  // bodies can differ (Node/error text, leftover statements).
  if (name.startsWith('indexes/') && l.status === 200) {
    for (const key of ['kind', 'count', 'hash']) {
      if (l[key] !== m[key]) mismatches.push(`${name}.${key}`);
    }
  } else if (name.startsWith('connection/') && l.status === 200) {
    if (l.kind !== m.kind) mismatches.push(`${name}.kind`);
  }
}
if (mismatches.length || !legacy.ok || !modern.ok) {
  console.error('NATIVE_CONNECTION_INDEXES_COMPARE_FAIL', { legacy, modern, mismatches });
  process.exit(1);
}
console.log('NATIVE_CONNECTION_INDEXES_COMPARE_OK', {
  paths: Object.fromEntries(names.map((n) => [n, {
    status: legacy.paths[n].status,
    kind: legacy.paths[n].kind,
    count: legacy.paths[n].count,
  }])),
});
NODE

if [[ "${KEEP_MODERN_NATIVE_ON}" == "1" ]]; then
  ssh -o BatchMode=yes "${MODERN_HOST}" \
    'cd /opt/learninglocker/app && MODE=on bash lab/scripts/set-native-get-flags.sh'
fi
