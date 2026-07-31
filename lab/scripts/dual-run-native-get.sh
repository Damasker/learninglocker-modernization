#!/usr/bin/env bash
set -euo pipefail

# Dual-run native GET smoke: restify baseline on legacy vs native flags on modern.
# Usage (workstation with ssh aliases):
#   bash lab/scripts/dual-run-native-get.sh

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

sync_branch() {
  local host="$1"
  if [[ "${SKIP_SYNC}" == "1" ]]; then
    return 0
  fi
  run "${host}" "cd /opt/learninglocker/app && git fetch origin ${BRANCH} && git reset --hard origin/${BRANCH} && chmod +x lab/scripts/*.sh"
}

echo "==== legacy restify baseline (${LEGACY_HOST}) ===="
sync_branch "${LEGACY_HOST}"
run "${LEGACY_HOST}" "cd /opt/learninglocker/app && MODE=off bash lab/scripts/set-native-get-flags.sh"
run "${LEGACY_HOST}" "cd /opt/learninglocker/app && bash lab/scripts/ensure-golden-fixtures.sh"
LEGACY_REPORT="$(run "${LEGACY_HOST}" "cd /opt/learninglocker/app && HOST_LABEL=ll-legacy NATIVE_MODE=off bash lab/scripts/native-get-smoke.sh | tee /tmp/native-get-legacy.out | awk '/^Report:/{print \$2}'")"

echo "==== modern native flags on (${MODERN_HOST}) ===="
sync_branch "${MODERN_HOST}"
run "${MODERN_HOST}" "cd /opt/learninglocker/app && yarn build-api-server && MODE=on bash lab/scripts/set-native-get-flags.sh"
# set-native-get-flags restarts API; rebuild ensures new routers are in dist.
run "${MODERN_HOST}" "cd /opt/learninglocker/app && bash lab/scripts/ensure-golden-fixtures.sh"
MODERN_REPORT="$(run "${MODERN_HOST}" "cd /opt/learninglocker/app && HOST_LABEL=ll-modern NATIVE_MODE=on bash lab/scripts/native-get-smoke.sh | tee /tmp/native-get-modern.out | awk '/^Report:/{print \$2}'")"

mkdir -p lab/reports
scp "${LEGACY_HOST}:${LEGACY_REPORT}" lab/reports/native-get-ll-legacy-off.json
scp "${MODERN_HOST}:${MODERN_REPORT}" lab/reports/native-get-ll-modern-on.json

bash lab/scripts/compare-native-get-reports.sh \
  lab/reports/native-get-ll-legacy-off.json \
  lab/reports/native-get-ll-modern-on.json

if [[ "${KEEP_MODERN_NATIVE_ON}" == "1" ]]; then
  echo "Keeping ${MODERN_HOST} native GET flags on (ADR 0014 stage 1)"
else
  run "${MODERN_HOST}" "cd /opt/learninglocker/app && MODE=off bash lab/scripts/set-native-get-flags.sh"
fi
