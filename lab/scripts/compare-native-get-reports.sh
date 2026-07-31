#!/usr/bin/env bash
set -euo pipefail

# Compare native-get smoke reports (status codes per path).
# Usage:
#   bash lab/scripts/compare-native-get-reports.sh <legacy-off.json> <modern-on.json>

LEFT="${1:?legacy/off report}"
RIGHT="${2:?modern/on report}"

node -e '
const left = require(require("path").resolve(process.argv[1]));
const right = require(require("path").resolve(process.argv[2]));
const lmap = Object.fromEntries(left.results.map((r) => [r.path, r]));
const rmap = Object.fromEntries(right.results.map((r) => [r.path, r]));
const paths = [...new Set([...Object.keys(lmap), ...Object.keys(rmap)])].sort();
let mismatches = 0;
console.log(`compare ${left.host}/${left.nativeMode} vs ${right.host}/${right.nativeMode}`);
for (const path of paths) {
  const ls = (lmap[path] || {}).status;
  const rs = (rmap[path] || {}).status;
  const ok = ls === rs;
  if (!ok) mismatches += 1;
  console.log(`${ok ? "PASS" : "DIFF"} ${path}: ${ls} -> ${rs}`);
}
if (mismatches) {
  console.log(`NATIVE_GET_COMPARE_FAIL (${mismatches} paths)`);
  process.exit(1);
}
console.log("NATIVE_GET_COMPARE_OK");
' "${LEFT}" "${RIGHT}"
