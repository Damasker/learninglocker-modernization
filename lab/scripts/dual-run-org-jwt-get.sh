#!/usr/bin/env bash
set -euo pipefail

# Compare scoped list response bodies: legacy restify vs modern native GET routers.

LEGACY_HOST="${LEGACY_HOST:-ll-legacy}"
MODERN_HOST="${MODERN_HOST:-ll-modern}"
BRANCH="${BRANCH:-master}"
SKIP_SYNC="${SKIP_SYNC:-0}"
# ADR 0014 stage 1: leave modern native GET flags on after the compare.
KEEP_MODERN_NATIVE_ON="${KEEP_MODERN_NATIVE_ON:-1}"

run() {
  local host="$1"
  shift
  ssh -o BatchMode=yes "${host}" "$@"
}

cleanup() {
  if [[ "${KEEP_MODERN_NATIVE_ON}" == "1" ]]; then
    echo "Keeping ${MODERN_HOST} native GET flags on (ADR 0014 stage 1)"
    return 0
  fi
  run "${MODERN_HOST}" \
    "cd /opt/learninglocker/app && MODE=off bash lab/scripts/set-native-get-flags.sh" \
    >/dev/null 2>&1 || true
}
trap cleanup EXIT

sync_branch() {
  local host="$1"
  if [[ "${SKIP_SYNC}" == "1" ]]; then
    return 0
  fi
  run "${host}" \
    "cd /opt/learninglocker/app && git fetch origin ${BRANCH} && git reset --hard origin/${BRANCH} && chmod +x lab/scripts/*.sh"
}

echo "==== legacy restify org-JWT baseline (${LEGACY_HOST}) ===="
sync_branch "${LEGACY_HOST}"
run "${LEGACY_HOST}" \
  "cd /opt/learninglocker/app && MODE=off bash lab/scripts/set-native-get-flags.sh && bash lab/scripts/ensure-golden-fixtures.sh"
legacy_report="$(run "${LEGACY_HOST}" \
  "cd /opt/learninglocker/app && HOST_LABEL=ll-legacy NATIVE_MODE=off bash lab/scripts/org-jwt-get-smoke.sh | tee /tmp/org-jwt-get-legacy.out | awk '/^Report:/{print \$2}'")"
if [[ -z "${legacy_report}" ]]; then
  run "${LEGACY_HOST}" "cat /tmp/org-jwt-get-legacy.out" >&2 || true
  echo "Legacy org-JWT smoke did not produce a report" >&2
  exit 1
fi

echo "==== modern native org-JWT run (${MODERN_HOST}) ===="
sync_branch "${MODERN_HOST}"
run "${MODERN_HOST}" \
  "cd /opt/learninglocker/app && yarn build-api-server && MODE=on bash lab/scripts/set-native-get-flags.sh && bash lab/scripts/ensure-golden-fixtures.sh"
modern_report="$(run "${MODERN_HOST}" \
  "cd /opt/learninglocker/app && HOST_LABEL=ll-modern NATIVE_MODE=on bash lab/scripts/org-jwt-get-smoke.sh | tee /tmp/org-jwt-get-modern.out | awk '/^Report:/{print \$2}'")"
if [[ -z "${modern_report}" ]]; then
  run "${MODERN_HOST}" "cat /tmp/org-jwt-get-modern.out" >&2 || true
  echo "Modern org-JWT smoke did not produce a report" >&2
  exit 1
fi

mkdir -p lab/reports
scp "${LEGACY_HOST}:${legacy_report}" lab/reports/org-jwt-get-ll-legacy-off.json
scp "${MODERN_HOST}:${modern_report}" lab/reports/org-jwt-get-ll-modern-on.json

node lab/scripts/compare-org-jwt-get-reports.js \
  lab/reports/org-jwt-get-ll-legacy-off.json \
  lab/reports/org-jwt-get-ll-modern-on.json
