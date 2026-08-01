#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01
set -euo pipefail

# Bootstrap one lab VM after the repo is cloned to /opt/learninglocker/app
# Usage: STACK=legacy|modern ./bootstrap-vm.sh
#
# Supported host OS: Debian 12/13, Ubuntu 22.04/24.04
# (install-host-deps.sh enforces the matrix).

STACK="${STACK:?STACK=legacy|modern required}"
ROOT=/opt/learninglocker
APP="${ROOT}/app"
XAPI="${ROOT}/xapi-service"
INFRA="${ROOT}/infra"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root: STACK=${STACK} sudo -E bash lab/scripts/bootstrap-vm.sh" >&2
  exit 1
fi

# Ensure docker/rsync/openssl/curl exist on Debian/Ubuntu hosts.
bash "${SCRIPT_DIR}/install-host-deps.sh"

mkdir -p "${INFRA}"
rsync -a --delete "${APP}/lab/${STACK}/" "${INFRA}/"
# Prefer scripts from the app checkout (source of truth).
cp "${APP}/lab/scripts/"*.sh "${INFRA}/"
chmod +x "${INFRA}/"*.sh "${SCRIPT_DIR}/"*.sh

# Stop earlier ad-hoc compose from first-boot experiments (any common home user).
for home in /home/ubuntu /home/debian /root; do
  if [[ -f "${home}/docker-compose.yml" ]]; then
    docker compose -f "${home}/docker-compose.yml" -p "$(basename "${home}")" down --remove-orphans || true
  fi
done

cd "${INFRA}"
docker compose -p ll down --remove-orphans || true
docker compose -p ll up -d

# Wait for Mongo before replica init.
for i in $(seq 1 60); do
  if docker compose -p ll exec -T mongo bash -lc 'command -v mongosh >/dev/null && mongosh --quiet --eval "db.adminCommand(\"ping\").ok" || mongo --quiet --eval "db.adminCommand(\"ping\").ok"' >/dev/null 2>&1; then
    break
  fi
  if [[ "${i}" -eq 60 ]]; then
    echo "Mongo did not become ready within timeout" >&2
    docker compose -p ll ps >&2 || true
    exit 1
  fi
  sleep 2
done

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

echo "Bootstrap complete for stack=${STACK} on $(. /etc/os-release; echo "${PRETTY_NAME}")"
