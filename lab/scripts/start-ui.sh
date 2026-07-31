#!/usr/bin/env bash
set -euo pipefail

# Start UIServer beside core for ADR 0014 stage-2 canary.
# Requires a prior build-ui.sh. Does not stop API/Worker/xAPI.
# Usage: ./start-ui.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"

mkdir -p "${APP}/logs" "${APP}/pids"
cd "${APP}"

if [[ ! -f ui/dist/server.js && ! -f ui/dist/server/index.js && ! -d ui/dist/server ]]; then
  echo "UI not built; run STACK=modern bash lab/scripts/build-ui.sh first" >&2
  exit 1
fi

# ADR 0014 stage 3: base overlay default-on; stack overlays pin modern/legacy.
STACK="${STACK:-}"
if [[ -z "${STACK}" ]]; then
  case "$(hostname -s 2>/dev/null || hostname)" in
    *modern*) STACK=modern ;;
    *legacy*) STACK=legacy ;;
  esac
fi
if [[ -f lab/scripts/apply-env-overlay.sh && -f lab/env/app.env.overlay ]]; then
  bash lab/scripts/apply-env-overlay.sh "${APP}/.env" lab/env/app.env.overlay
fi
if [[ "${STACK}" == "modern" && -f lab/env/app.env.overlay.modern-native-get ]]; then
  bash lab/scripts/apply-env-overlay.sh "${APP}/.env" lab/env/app.env.overlay.modern-native-get
fi
if [[ "${STACK}" == "legacy" && -f lab/env/app.env.overlay.legacy-restify ]]; then
  bash lab/scripts/apply-env-overlay.sh "${APP}/.env" lab/env/app.env.overlay.legacy-restify
fi

pm2 delete UIServer >/dev/null 2>&1 || true
pm2 start pm2/ui.json
pm2 save >/dev/null 2>&1 || true

UI_PORT="$(grep -E '^UI_PORT=' "${APP}/.env" | cut -d= -f2- || echo 3000)"
SITE_URL="$(grep -E '^SITE_URL=' "${APP}/.env" | cut -d= -f2- || echo "http://127.0.0.1:${UI_PORT}")"

echo "Waiting for UI :${UI_PORT} ..."
for i in $(seq 1 60); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${UI_PORT}/" || true)"
  if [[ "${code}" != "000" ]]; then
    echo "UI HTTP ${code} at ${SITE_URL}"
    pm2 list
    exit 0
  fi
  sleep 2
done

echo "Timed out waiting for UIServer" >&2
pm2 list || true
tail -n 40 "${APP}/logs/ui_stderr.log" 2>/dev/null || true
exit 1
