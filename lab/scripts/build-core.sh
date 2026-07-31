#!/usr/bin/env bash
set -euo pipefail

# Build API / worker / CLI (and optionally xapi-service) for golden-path dual-run.
# Usage:
#   STACK=modern ./build-core.sh
#   STACK=legacy ./build-core.sh

STACK="${STACK:-modern}"
APP="${APP_ROOT:-/opt/learninglocker/app}"
XAPI="${XAPI_ROOT:-/opt/learninglocker/xapi-service}"

# Host tools (needed for xapi-service and pm2). On Ubuntu lab VMs Node may
# only be on PATH for login shells; also support NodeSource locations.
export PATH="/usr/local/bin:/usr/bin:${PATH:-}"

cd "${APP}"

if [[ "${STACK}" == "legacy" ]]; then
  if ! command -v ll-node10-exec >/dev/null 2>&1; then
    echo "ll-node10-exec missing; run STACK=legacy bash lab/scripts/install-node.sh" >&2
    exit 1
  fi
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

# xapi-service is TypeScript and needs Node 16+ / yarn on the host (or Node 20).
if [[ "${SKIP_XAPI:-0}" != "1" ]]; then
  if ! command -v yarn >/dev/null 2>&1 || ! command -v node >/dev/null 2>&1; then
    echo "Host node/yarn required for xapi-service. On legacy install with:" >&2
    echo "  STACK=modern bash lab/scripts/install-node.sh" >&2
    echo "(Node 20 host runtime + Node 10 docker helper can coexist.)" >&2
    exit 1
  fi
  cd "${XAPI}"
  if [[ ! -d node_modules ]]; then
    yarn install --frozen-lockfile --ignore-engines
  fi
  yarn build
fi

echo "Core build complete (stack=${STACK})"
