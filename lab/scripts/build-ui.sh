#!/usr/bin/env bash
set -euo pipefail

# Build UI client + server for canary (ADR 0014 stage 2).
# Usage:
#   STACK=modern ./build-ui.sh

STACK="${STACK:-modern}"
APP="${APP_ROOT:-/opt/learninglocker/app}"

export PATH="/usr/local/bin:/usr/bin:${PATH:-}"
cd "${APP}"

if [[ "${STACK}" == "legacy" ]]; then
  if ! command -v ll-node10-exec >/dev/null 2>&1; then
    echo "ll-node10-exec missing; run STACK=legacy bash lab/scripts/install-node.sh" >&2
    exit 1
  fi
  ll-node10-exec 'yarn build-ui-server'
  ll-node10-exec 'yarn build-ui-client'
else
  yarn build-ui-server
  yarn build-ui-client
fi

echo "UI build complete (stack=${STACK})"
