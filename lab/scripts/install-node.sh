#!/usr/bin/env bash
set -euo pipefail

# Install Node runtime helpers for the lab VM.
# legacy -> Node 10 via pinned Docker image wrappers
# modern -> Node 20 via NodeSource

STACK="${STACK:?STACK=legacy|modern required}"

if [[ "${STACK}" == "modern" ]]; then
  if command -v node >/dev/null 2>&1 && node -v | grep -q '^v20\.'; then
    echo "Node $(node -v) already installed"
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
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
  sudo docker pull node:10-bullseye
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
  node:10-bullseye \
  bash -lc "npm install -g yarn@1.22.19 >/dev/null 2>&1; $*"
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
