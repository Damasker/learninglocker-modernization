#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01 (A001)
set -euo pipefail

# Fetch and checkout an app branch on a lab VM.
# Usage: BRANCH=feat/lab-dual-run-golden-path ./sync-app-branch.sh
#
# Husky post-checkout runs yarn clean-cache and wipes */dist. Lab syncs skip
# that wipe by default so a follow-up build is not forced on every sync.
# Set LL_SKIP_CLEAN_CACHE=0 to restore the upstream clean-on-checkout behavior.

BRANCH="${BRANCH:?BRANCH required}"
APP="${APP_ROOT:-/opt/learninglocker/app}"

cd "${APP}"
git fetch origin "${BRANCH}"
git reset --hard
git clean -fd
export LL_SKIP_CLEAN_CACHE="${LL_SKIP_CLEAN_CACHE:-1}"
git checkout -B "${BRANCH}" "origin/${BRANCH}"

echo "Synced ${APP} to ${BRANCH} @ $(git rev-parse --short HEAD) (LL_SKIP_CLEAN_CACHE=${LL_SKIP_CLEAN_CACHE})"
echo "If dist/ is missing or stale, run: STACK=legacy|modern bash lab/scripts/build-core.sh"
