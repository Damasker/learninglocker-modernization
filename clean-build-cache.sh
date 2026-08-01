#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01
set -euo pipefail

# Husky post-checkout runs `yarn clean-cache`. Lab syncs can set
# LL_SKIP_CLEAN_CACHE=1 to keep dist/ after checkout (then rebuild only when needed).
if [ "${LL_SKIP_CLEAN_CACHE:-0}" = "1" ]; then
  echo 'Skipping clean-build-cache (LL_SKIP_CLEAN_CACHE=1)'
  exit 0
fi

echo 'Removing "cli/src/node_modules"'
rm -R -f cli/src/node_modules

echo 'Removing "worker/src/node_modules"'
rm -R -f worker/src/node_modules

echo 'Removing "api/src/node_modules"'
rm -R -f api/src/node_modules

echo 'Removing "ui/src/node_modules"'
rm -R -f ui/src/node_modules


echo 'Removing "cli/dist"'
rm -R -f cli/dist

echo 'Removing "worker/dist"'
rm -R -f worker/dist

echo 'Removing "api/dist"'
rm -R -f api/dist

echo 'Removing "ui/dist"'
rm -R -f ui/dist
