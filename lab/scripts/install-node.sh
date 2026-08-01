#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01
set -euo pipefail

# Install Node runtime helpers for the lab VM.
# legacy -> Node 10 via pinned Docker image wrappers
# modern -> Node 20 via NodeSource nodistro (Debian 12/13, Ubuntu 22.04/24.04)
#
# Usage: STACK=legacy|modern ./install-node.sh

STACK="${STACK:?STACK=legacy|modern required}"

require_debian_family() {
  if [[ ! -f /etc/os-release ]]; then
    echo "Missing /etc/os-release; only Debian/Ubuntu are supported" >&2
    exit 1
  fi
  # shellcheck disable=SC1091
  . /etc/os-release
  case "${ID:-}" in
    debian|ubuntu) ;;
    *)
      echo "Unsupported OS ID=${ID:-unknown} (${PRETTY_NAME:-})" >&2
      echo "Supported: Debian 12/13, Ubuntu 22.04/24.04" >&2
      exit 1
      ;;
  esac
  local major="${VERSION_ID%%.*}"
  if [[ "${ID}" == "debian" && "${major}" != "12" && "${major}" != "13" ]]; then
    echo "Unsupported Debian ${VERSION_ID}; need 12 or 13" >&2
    exit 1
  fi
  if [[ "${ID}" == "ubuntu" && "${major}" != "22" && "${major}" != "24" ]]; then
    echo "Unsupported Ubuntu ${VERSION_ID}; need 22.04 or 24.04" >&2
    exit 1
  fi
}

install_node20_nodesource() {
  export DEBIAN_FRONTEND=noninteractive
  sudo apt-get update -y
  sudo apt-get install -y --no-install-recommends ca-certificates curl gnupg

  # Prefer explicit nodistro + keyring (works on Debian 13 / modern apt policy).
  sudo mkdir -p /usr/share/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
  echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
    | sudo tee /etc/apt/sources.list.d/nodesource.list >/dev/null

  if ! sudo apt-get update -y; then
    echo "WARN: nodistro apt update failed; falling back to setup_20.x" >&2
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  fi

  sudo apt-get install -y nodejs
  # Native addon builds (yarn install) need a compiler toolchain.
  sudo apt-get install -y --no-install-recommends build-essential python3
}

if [[ "${STACK}" == "modern" ]]; then
  require_debian_family
  if command -v node >/dev/null 2>&1 && node -v | grep -q '^v20\.'; then
    echo "Node $(node -v) already installed"
  else
    install_node20_nodesource
  fi
  if ! command -v yarn >/dev/null 2>&1; then
    sudo npm install -g yarn@1.22.22
  fi
  if ! command -v pm2 >/dev/null 2>&1; then
    sudo npm install -g pm2@5
  fi
  node -v
  yarn -v
  pm2 -v
  exit 0
fi

if [[ "${STACK}" == "legacy" ]]; then
  require_debian_family
  if ! command -v docker >/dev/null 2>&1; then
    echo "docker missing; run: sudo -E bash lab/scripts/install-host-deps.sh" >&2
    exit 1
  fi
  # Official node:10 tag remains available; distro-specific tags may be gone.
  sudo docker pull node:10
  sudo tee /usr/local/bin/ll-node10-exec >/dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
workdir="${PWD}"
exec sudo docker run --rm \
  --network host \
  -v /opt/learninglocker:/opt/learninglocker \
  -v "${workdir}:${workdir}" \
  -w "${workdir}" \
  -e HOME=/tmp \
  -e npm_config_cache=/tmp/.npm \
  node:10 \
  bash -lc 'npm install -g yarn@1.22.19 >/tmp/yarn-global-install.log 2>&1 || cat /tmp/yarn-global-install.log; export PATH="/usr/local/bin:$PATH"; exec bash -lc "$*"'
EOF
  sudo tee /usr/local/bin/ll-node10 >/dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
exec ll-node10-exec "$@"
EOF
  sudo chmod +x /usr/local/bin/ll-node10 /usr/local/bin/ll-node10-exec
  ll-node10-exec 'node -v && yarn -v'
  echo "Legacy Node 10 helper installed (ll-node10 / ll-node10-exec)"
  exit 0
fi

echo "Unknown STACK=${STACK}" >&2
exit 1
