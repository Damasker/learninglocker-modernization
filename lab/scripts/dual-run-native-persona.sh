#!/usr/bin/env bash
set -euo pipefail

# Dual-run Persona/PersonaIdentifier GETs across lab hosts (ADR 0021).
# Usage:
#   BRANCH=feat/... bash lab/scripts/dual-run-native-persona.sh

BRANCH="${BRANCH:-master}"
LEGACY_HOST="${LEGACY_HOST:-ll-legacy}"
MODERN_HOST="${MODERN_HOST:-ll-modern}"
SKIP_BUILD="${SKIP_BUILD:-0}"
SKIP_SYNC="${SKIP_SYNC:-0}"

run_remote() {
  local host="$1"
  local stack="$2"
  local label="$3"

  ssh -o BatchMode=yes "${host}" "cd /opt/learninglocker/app && \
    if [ '${SKIP_SYNC}' != '1' ]; then BRANCH='${BRANCH}' bash lab/scripts/sync-app-branch.sh; fi && \
    if [ '${SKIP_BUILD}' != '1' ]; then STACK='${stack}' bash lab/scripts/build-core.sh; fi && \
    STACK='${stack}' bash lab/scripts/start-core.sh || true && \
    HOST_LABEL='${label}' bash lab/scripts/native-persona-smoke.sh"
}

run_remote "${LEGACY_HOST}" legacy ll-legacy
run_remote "${MODERN_HOST}" modern ll-modern

mkdir -p lab/reports
scp -o BatchMode=yes \
  "${LEGACY_HOST}:/opt/learninglocker/app/lab/reports/ll-legacy-native-persona.json" \
  lab/reports/
scp -o BatchMode=yes \
  "${MODERN_HOST}:/opt/learninglocker/app/lab/reports/ll-modern-native-persona.json" \
  lab/reports/

node <<'NODE'
const fs = require('fs');
const legacy = JSON.parse(fs.readFileSync('lab/reports/ll-legacy-native-persona.json', 'utf8'));
const modern = JSON.parse(fs.readFileSync('lab/reports/ll-modern-native-persona.json', 'utf8'));
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
  if (l.status !== 200) continue;
  if (l.kind !== m.kind) mismatches.push(`${name}.kind`);
  // Hosts keep independent Mongo; list/count/connection drift by fixture volume.
  // Golden by-id bodies must still match across hosts.
  if (name === 'personaById' || name === 'personaIdentifierById') {
    if (l.hash !== m.hash) mismatches.push(`${name}.hash`);
    if (l.count !== m.count) mismatches.push(`${name}.count`);
  }
}
if (mismatches.length || !legacy.ok || !modern.ok) {
  console.error('NATIVE_PERSONA_COMPARE_FAIL', { legacy, modern, mismatches });
  process.exit(1);
}
console.log('NATIVE_PERSONA_COMPARE_OK', {
  paths: Object.fromEntries(names.map((n) => [n, {
    status: legacy.paths[n].status,
    kind: legacy.paths[n].kind,
    count: legacy.paths[n].count,
  }])),
});
NODE
