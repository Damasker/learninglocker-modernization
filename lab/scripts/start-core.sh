#!/usr/bin/env bash
set -euo pipefail

# Start API + Worker + xAPI for golden-path dual-run (no UI).
# Usage: ./start-core.sh

APP="${APP_ROOT:-/opt/learninglocker/app}"
XAPI="${XAPI_ROOT:-/opt/learninglocker/xapi-service}"

mkdir -p "${APP}/logs" "${APP}/pids" "${XAPI}/logs" "${XAPI}/pids"

cd "${APP}"
# Re-apply overlays so new ENABLE_NATIVE_* keys land without wiping APP_SECRET.
if [[ -f lab/scripts/apply-env-overlay.sh && -f lab/env/app.env.overlay ]]; then
  bash lab/scripts/apply-env-overlay.sh "${APP}/.env" lab/env/app.env.overlay
fi
if [[ -f lab/scripts/apply-env-overlay.sh && -f lab/env/xapi.env.overlay ]]; then
  bash lab/scripts/apply-env-overlay.sh "${XAPI}/.env" lab/env/xapi.env.overlay
fi

pm2 delete API Worker xAPI >/dev/null 2>&1 || true
pm2 start pm2/core.json
(
  cd "${XAPI}"
  pm2 start pm2/xapi.json
)
pm2 save >/dev/null 2>&1 || true

echo "Waiting for API :8080 and xAPI :8081 ..."
for i in $(seq 1 60); do
  api_code="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/ || true)"
  xapi_code="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/ || true)"
  if [[ "${api_code}" != "000" && "${xapi_code}" != "000" ]]; then
    echo "API HTTP ${api_code}, xAPI HTTP ${xapi_code}"
    pm2 list
    exit 0
  fi
  sleep 2
done

echo "Timed out waiting for services" >&2
pm2 list || true
tail -n 40 "${APP}/logs/api_stderr.log" 2>/dev/null || true
tail -n 40 "${XAPI}/logs/xapi_stderr.log" 2>/dev/null || true
exit 1
