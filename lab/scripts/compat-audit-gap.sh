#!/usr/bin/env bash
# @ll-compat-audit: ok 2026-08-01
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "${ROOT}"
exec node lab/scripts/compat-audit-gap.js "$@"
