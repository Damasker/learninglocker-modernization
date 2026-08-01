#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01
set -euo pipefail

# Install host packages needed by lab bootstrap on Debian/Ubuntu.
# Supported: Debian 12 (bookworm), Debian 13 (trixie),
#            Ubuntu 22.04 (jammy), Ubuntu 24.04 (noble).
# Usage: sudo -E bash lab/scripts/install-host-deps.sh

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run as root (sudo -E bash lab/scripts/install-host-deps.sh)" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

if [[ ! -f /etc/os-release ]]; then
  echo "Missing /etc/os-release; only Debian/Ubuntu are supported" >&2
  exit 1
fi
# shellcheck disable=SC1091
. /etc/os-release

ID_LC="${ID:-unknown}"
VERSION_ID_RAW="${VERSION_ID:-0}"
VERSION_MAJOR="${VERSION_ID_RAW%%.*}"

supported=0
case "${ID_LC}" in
  debian)
    if [[ "${VERSION_MAJOR}" == "12" || "${VERSION_MAJOR}" == "13" ]]; then
      supported=1
    fi
    ;;
  ubuntu)
    if [[ "${VERSION_MAJOR}" == "22" || "${VERSION_MAJOR}" == "24" ]]; then
      supported=1
    fi
    ;;
esac

if [[ "${supported}" -ne 1 ]]; then
  echo "Unsupported OS: ${PRETTY_NAME:-$ID_LC $VERSION_ID_RAW}" >&2
  echo "Supported: Debian 12/13, Ubuntu 22.04/24.04" >&2
  exit 1
fi

echo "Installing host deps on ${PRETTY_NAME:-$ID_LC $VERSION_ID_RAW}"

apt-get update -y
apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  gnupg \
  rsync \
  openssl \
  git \
  jq \
  build-essential \
  python3 \
  make \
  g++ \
  apt-transport-https \
  software-properties-common

install_docker() {
  if command -v docker >/dev/null 2>&1; then
    echo "docker already present: $(docker --version)"
  else
    # Distro packages are enough for lab (Mongo/Redis compose).
    apt-get install -y --no-install-recommends docker.io
  fi

  # Prefer Compose V2 plugin (`docker compose`).
  if docker compose version >/dev/null 2>&1; then
    echo "docker compose already present: $(docker compose version)"
    return 0
  fi

  # Package names differ across Debian/Ubuntu releases.
  if apt-get install -y --no-install-recommends docker-compose-v2; then
    :
  elif apt-get install -y --no-install-recommends docker-compose-plugin; then
    :
  else
    echo "WARN: could not install compose plugin package; trying standalone binary" >&2
    local arch
    arch="$(uname -m)"
    case "${arch}" in
      x86_64|amd64) arch=x86_64 ;;
      aarch64|arm64) arch=aarch64 ;;
      *)
        echo "Unsupported arch for compose fallback: ${arch}" >&2
        exit 1
        ;;
    esac
    local ver="v2.29.7"
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -fsSL \
      "https://github.com/docker/compose/releases/download/${ver}/docker-compose-linux-${arch}" \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "docker compose still unavailable after install" >&2
    exit 1
  fi
  echo "docker compose ready: $(docker compose version)"
}

install_docker

systemctl enable --now docker >/dev/null 2>&1 || true

# Allow invoking docker without sudo when a non-root caller is known.
if [[ -n "${SUDO_USER:-}" && "${SUDO_USER}" != "root" ]]; then
  usermod -aG docker "${SUDO_USER}" || true
  echo "Added ${SUDO_USER} to docker group (re-login may be required)"
fi

echo "Host deps OK (${ID_LC} ${VERSION_ID_RAW})"
docker --version
docker compose version
