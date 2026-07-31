#!/usr/bin/env bash
set -euo pipefail

# Fetch and checkout an app branch on a lab VM.
# Usage: BRANCH=feat/lab-dual-run-golden-path ./sync-app-branch.sh

BRANCH="${BRANCH:?BRANCH required}"
APP="${APP_ROOT:-/opt/learninglocker/app}"

cd "${APP}"
git fetch origin "${BRANCH}"
git reset --hard
git clean -fd
git checkout -B "${BRANCH}" "origin/${BRANCH}"

echo "Synced ${APP} to ${BRANCH} @ $(git rev-parse --short HEAD)"
