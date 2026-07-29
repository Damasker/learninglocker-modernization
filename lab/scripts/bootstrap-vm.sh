#!/usr/bin/env bash
set -euo pipefail

# Bootstrap one lab VM after the repo is cloned to /opt/learninglocker/app
# Usage: STACK=legacy|modern ./bootstrap-vm.sh

STACK="${STACK:?STACK=legacy|modern required}"
ROOT=/opt/learninglocker
APP="${ROOT}/app"
XAPI="${ROOT}/xapi-service"
INFRA="${ROOT}/infra"

mkdir -p "${INFRA}"
rsync -a --delete "${APP}/lab/${STACK}/" "${INFRA}/"
cp "${APP}/lab/scripts/"*.sh "${INFRA}/"
chmod +x "${INFRA}/"*.sh

cd "${INFRA}"
docker compose -p ll down --remove-orphans || true
docker compose -p ll up -d
./init-replica.sh

if [[ ! -f "${APP}/.env" ]]; then
  cp "${APP}/.env.example" "${APP}/.env"
fi
if [[ ! -f "${XAPI}/.env" ]]; then
  cp "${XAPI}/.env.example" "${XAPI}/.env"
fi

./apply-env-overlay.sh "${APP}/.env" "${APP}/lab/env/app.env.overlay"
./apply-env-overlay.sh "${XAPI}/.env" "${APP}/lab/env/xapi.env.overlay"

if grep -q 'APP_SECRET=REPLACE_ME' "${APP}/.env" || grep -qE '^APP_SECRET=$' "${APP}/.env"; then
  secret="$(openssl rand -hex 32)"
  # rewrite only APP_SECRET
  awk -v s="${secret}" '
    BEGIN { FS=OFS="=" }
    $1=="APP_SECRET" { print "APP_SECRET="s; next }
    { print }
  ' "${APP}/.env" > "${APP}/.env.tmp"
  mv "${APP}/.env.tmp" "${APP}/.env"
  echo "Generated APP_SECRET"
fi

echo "Bootstrap complete for stack=${STACK}"
