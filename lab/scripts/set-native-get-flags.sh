#!/usr/bin/env bash
set -euo pipefail

# Toggle all ENABLE_NATIVE_*_ROUTER flags in the app .env and restart API.
# Usage:
#   MODE=on bash lab/scripts/set-native-get-flags.sh
#   MODE=off bash lab/scripts/set-native-get-flags.sh

MODE="${MODE:?MODE=on|off required}"
APP="${APP_ROOT:-/opt/learninglocker/app}"
ENV_FILE="${APP}/.env"

case "${MODE}" in
  on) VALUE=true ;;
  off) VALUE=false ;;
  *)
    echo "MODE must be on or off" >&2
    exit 1
    ;;
esac

FLAGS=(
  ENABLE_NATIVE_CLIENT_ROUTER
  ENABLE_NATIVE_LRS_ROUTER
  ENABLE_NATIVE_ORGANISATION_ROUTER
  ENABLE_NATIVE_ROLE_ROUTER
  ENABLE_NATIVE_USER_ROUTER
  ENABLE_NATIVE_DASHBOARD_ROUTER
  ENABLE_NATIVE_VISUALISATION_ROUTER
  ENABLE_NATIVE_QUERY_ROUTER
  ENABLE_NATIVE_EXPORT_ROUTER
  ENABLE_NATIVE_DOWNLOAD_ROUTER
  ENABLE_NATIVE_PERSONA_ATTRIBUTE_ROUTER
  ENABLE_NATIVE_PERSONAS_IMPORT_ROUTER
  ENABLE_NATIVE_PERSONAS_IMPORT_TEMPLATE_ROUTER
  ENABLE_NATIVE_IMPORT_CSV_ROUTER
  ENABLE_NATIVE_SITE_SETTINGS_ROUTER
  ENABLE_NATIVE_STREAM_ROUTER
  ENABLE_NATIVE_BATCH_DELETE_ROUTER
  ENABLE_NATIVE_STATEMENT_FORWARDING_ROUTER
  ENABLE_NATIVE_QUERY_BUILDER_CACHE_ROUTER
  ENABLE_NATIVE_QUERY_BUILDER_CACHE_VALUE_ROUTER
)

tmp="$(mktemp)"
cp "${ENV_FILE}" "${tmp}"

for flag in "${FLAGS[@]}"; do
  if grep -qE "^${flag}=" "${tmp}"; then
    awk -v k="${flag}" -v v="${VALUE}" '
      BEGIN { FS=OFS="=" }
      $1==k && !done { print k"="v; done=1; next }
      { print }
      END { if (!done) print k"="v }
    ' "${tmp}" > "${tmp}.new"
    mv "${tmp}.new" "${tmp}"
  else
    printf '%s=%s\n' "${flag}" "${VALUE}" >> "${tmp}"
  fi
done

mv "${tmp}" "${ENV_FILE}"
echo "Set native GET flags to ${VALUE}"

cd "${APP}"
# API watches .env in some pm2 configs; force restart for fork mode.
pm2 restart API --update-env
sleep 3
curl -s -o /dev/null -w 'API HTTP %{http_code}\n' http://127.0.0.1:8080/ || true
grep -E '^ENABLE_NATIVE_' "${ENV_FILE}" | sort
