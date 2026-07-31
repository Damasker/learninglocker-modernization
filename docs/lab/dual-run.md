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

Native GET strangler flags stay **off** during the first golden pass so both hosts exercise restify reads. Flip `ENABLE_NATIVE_*` on `ll-modern` only for flag-on parity later.

## Reports

JSON under `lab/reports/` (gitignored). Summarize outcomes in `docs/lab/dual-run-findings.md`.
