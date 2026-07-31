#!/usr/bin/env bash
set -euo pipefail

# Merge KEY=VALUE overlays into a target .env without printing secrets.
# Usage: ./apply-env-overlay.sh <target.env> <overlay.env>

target="${1:?target env required}"
overlay="${2:?overlay env required}"

tmp="$(mktemp)"
cp "${target}" "${tmp}"

while IFS= read -r line || [[ -n "${line}" ]]; do
  [[ -z "${line}" || "${line}" =~ ^[[:space:]]*# ]] && continue
  key="${line%%=*}"
  value="${line#*=}"
  if grep -qE "^${key}=" "${tmp}"; then
    # portable in-place replace for first matching key
    awk -v k="${key}" -v v="${value}" '
      BEGIN { FS=OFS="=" }
      $1==k && !done { print k"="v; done=1; next }
      { print }
      END { if (!done) print k"="v }
    ' "${tmp}" > "${tmp}.new"
    mv "${tmp}.new" "${tmp}"
  else
    printf '%s=%s\n' "${key}" "${value}" >> "${tmp}"
  fi
done < "${overlay}"

mv "${tmp}" "${target}"
echo "Applied overlay to ${target}"
