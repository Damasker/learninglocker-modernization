#!/usr/bin/env bash
set -euo pipefail

# Run golden path on both lab VMs from a workstation with ssh aliases.
# Usage (from repo root on Windows/WSL/Linux):
#   bash lab/scripts/dual-run-golden.sh
#
# Optional:
#   BRANCH=feat/lab-dual-run-golden-path SKIP_BUILD=1 bash lab/scripts/dual-run-golden.sh

BRANCH="${BRANCH:-feat/lab-dual-run-golden-path}"
SKIP_BUILD="${SKIP_BUILD:-0}"
SKIP_SYNC="${SKIP_SYNC:-0}"
LEGACY_HOST="${LEGACY_HOST:-ll-legacy}"
MODERN_HOST="${MODERN_HOST:-ll-modern}"

run_remote() {
  local host="$1"
  local stack="$2"
  shift 2
  ssh -o BatchMode=yes "${host}" "$@"
}

prepare_host() {
  local host="$1"
  local stack="$2"

  echo "==== prepare ${host} (${stack}) ===="
  if [[ "${SKIP_SYNC}" != "1" ]]; then
    run_remote "${host}" "${stack}" "cd /opt/learninglocker/app && BRANCH=${BRANCH} bash lab/scripts/sync-app-branch.sh"
  fi
  if [[ "${SKIP_BUILD}" != "1" ]]; then
    run_remote "${host}" "${stack}" "cd /opt/learninglocker/app && STACK=${stack} bash lab/scripts/build-core.sh"
  fi
  run_remote "${host}" "${stack}" "cd /opt/learninglocker/app && bash lab/scripts/start-core.sh"
  run_remote "${host}" "${stack}" "cd /opt/learninglocker/app && bash lab/scripts/ensure-golden-fixtures.sh"
  run_remote "${host}" "${stack}" "cd /opt/learninglocker/app && HOST_LABEL=${host} bash lab/scripts/golden-path.sh"
}

prepare_host "${MODERN_HOST}" modern
prepare_host "${LEGACY_HOST}" legacy

echo "Dual-run golden path finished on ${MODERN_HOST} and ${LEGACY_HOST}"
