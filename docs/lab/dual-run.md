# Lab dual-run golden path

## Goal

Differential check of the compatibility freeze golden path on `ll-legacy` vs `ll-modern`:

1. Authenticated client stores a statement through xAPI  
2. Document appears in Mongo with expected envelope fields  
3. Redis notify triggers worker  
4. Persona extract and query-builder cache complete  
5. Aggregate/count APIs return scoped results  

## Scripts

| Script | Role |
|--------|------|
| `lab/scripts/sync-app-branch.sh` | `git fetch/checkout` on a VM |
| `lab/scripts/build-core.sh` | yarn install + build API/worker/CLI (+ xapi-service) |
| `lab/scripts/start-core.sh` | pm2 API + Worker + xAPI (`pm2/core.json`) |
| `lab/scripts/ensure-golden-fixtures.sh` | upsert synthetic org/LRS/client with fixed basic auth |
| `lab/scripts/golden-path.sh` | run the five checks; write `lab/reports/*.json` |
| `lab/scripts/dual-run-golden.sh` | orchestrate both VMs from the workstation |
| `lab/scripts/set-native-get-flags.sh` | toggle all `ENABLE_NATIVE_*_ROUTER` flags + restart API |
| `lab/scripts/native-get-smoke.sh` | GET `/v2/*` list endpoints with golden client auth |
| `lab/scripts/compare-native-get-reports.sh` | compare status codes between two smoke reports |
| `lab/scripts/dual-run-native-get.sh` | legacy flags-off vs modern flags-on |

Fixed lab credentials (synthetic only):

- org `aaaaaaaaaaaaaaaaaaaaaaaa`
- lrs `bbbbbbbbbbbbbbbbbbbbbbbb`
- client `cccccccccccccccccccccccc`
- basic key/secret: `lab_golden_key_00000000000000000001` / `lab_golden_secret_000000000000000001`

## One-host run

```bash
cd /opt/learninglocker/app
BRANCH=feat/lab-dual-run-golden-path bash lab/scripts/sync-app-branch.sh
STACK=modern bash lab/scripts/build-core.sh
bash lab/scripts/start-core.sh
bash lab/scripts/ensure-golden-fixtures.sh
bash lab/scripts/ensure-persona-collections.sh
HOST_LABEL=ll-modern bash lab/scripts/golden-path.sh
```

## Dual-run from workstation

```bash
bash lab/scripts/dual-run-golden.sh
# or after first build:
SKIP_BUILD=1 bash lab/scripts/dual-run-golden.sh
```

Native GET strangler flags stay **off** during the first golden pass so both hosts exercise restify reads.

## Native GET flag-on dual-run

```bash
# On each host, or via workstation orchestrator:
bash lab/scripts/dual-run-native-get.sh

# Manual:
# ll-legacy
MODE=off bash lab/scripts/set-native-get-flags.sh
HOST_LABEL=ll-legacy NATIVE_MODE=off bash lab/scripts/native-get-smoke.sh

# ll-modern (after yarn build-api-server)
MODE=on bash lab/scripts/set-native-get-flags.sh
HOST_LABEL=ll-modern NATIVE_MODE=on bash lab/scripts/native-get-smoke.sh

bash lab/scripts/compare-native-get-reports.sh \
  lab/reports/native-get-ll-legacy-off.json \
  lab/reports/native-get-ll-modern-on.json
```

Same HTTP status per path is the pass criterion (client basic auth; 403 is OK if both sides match).

## Reports

JSON under `lab/reports/` (gitignored). Summarize outcomes in `docs/lab/dual-run-findings.md`.
