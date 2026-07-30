#!/usr/bin/env bash
set -euo pipefail

# Compare native-get smoke reports (status codes per path).
# Usage:
#   bash lab/scripts/compare-native-get-reports.sh <legacy-off.json> <modern-on.json>

LEFT="${1:?legacy/off report}"
RIGHT="${2:?modern/on report}"

python3 - <<'PY' "${LEFT}" "${RIGHT}"
import json, sys
left_path, right_path = sys.argv[1], sys.argv[2]
left = json.load(open(left_path))
right = json.load(open(right_path))
lmap = {r["path"]: r for r in left["results"]}
rmap = {r["path"]: r for r in right["results"]}
paths = sorted(set(lmap) | set(rmap))
mismatches = []
print(f"compare {left.get('host')}/{left.get('nativeMode')} vs {right.get('host')}/{right.get('nativeMode')}")
for path in paths:
    l = lmap.get(path, {})
    r = rmap.get(path, {})
    ls, rs = l.get("status"), r.get("status")
    mark = "PASS" if ls == rs else "DIFF"
    print(f"{mark} {path}: {ls} -> {rs}")
    if ls != rs:
        mismatches.append(path)
if mismatches:
    print(f"NATIVE_GET_COMPARE_FAIL ({len(mismatches)} paths)")
    sys.exit(1)
print("NATIVE_GET_COMPARE_OK")
PY
