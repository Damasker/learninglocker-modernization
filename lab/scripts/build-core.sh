#!/usr/bin/env bash
set -euo pipefail

# Build API / worker / CLI (and optionally xapi-service) for golden-path dual-run.
# Usage:
#   STACK=modern ./build-core.sh
#   STACK=legacy ./build-core.sh

STACK="${STACK:-modern}"
APP="${APP_ROOT:-/opt/learninglocker/app}"
XAPI="${XAPI_ROOT:-/opt/learninglocker/xapi-service}"

cd "${APP}"

if [[ "${STACK}" == "legacy" ]]; then
  ll-node10-exec 'yarn install --frozen-lockfile --ignore-engines --ignore-scripts'
  ll-node10-exec 'yarn build-api-server'
  ll-node10-exec 'yarn build-worker-server'
  ll-node10-exec 'yarn build-cli-server'
else
  yarn install --frozen-lockfile --ignore-engines
  yarn build-api-server
  yarn build-worker-server
  yarn build-cli-server
fi

# xapi-service is TypeScript and runs on Node 20 even on the legacy VM.
if [[ "${SKIP_XAPI:-0}" != "1" ]]; then
  cd "${XAPI}"
  if [[ ! -d node_modules ]]; then
    yarn install --frozen-lockfile --ignore-engines
  fi
  yarn build
fi

echo "Core build complete (stack=${STACK})"
