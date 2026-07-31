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
| `lab/scripts/ensure-golden-fixtures.sh` | upsert synthetic org/LRS/client/user + deterministic cache fixtures |
| `lab/scripts/golden-path.sh` | run the five checks; write `lab/reports/*.json` |
| `lab/scripts/dual-run-golden.sh` | orchestrate both VMs from the workstation |
| `lab/scripts/set-native-get-flags.sh` | toggle all `ENABLE_NATIVE_*_ROUTER` flags + restart API |
| `lab/scripts/native-get-smoke.sh` | GET `/v2/*` list endpoints with golden client auth |
| `lab/scripts/compare-native-get-reports.sh` | compare status codes between two smoke reports |
| `lab/scripts/dual-run-native-get.sh` | legacy flags-off vs modern flags-on |
| `lab/scripts/org-jwt-get-smoke.sh` | GET scoped `/v2/*` lists with a synthetic org-admin JWT |
| `lab/scripts/canonical-json-report.js` | hash canonical JSON after removing volatile/auth fields |
| `lab/scripts/compare-org-jwt-get-reports.js` | require 200 + equal kind/count/body hash per path |
| `lab/scripts/dual-run-org-jwt-get.sh` | orchestrate org-JWT body parity across both VMs |

Fixed lab credentials (synthetic only):

- org `aaaaaaaaaaaaaaaaaaaaaaaa`
- lrs `bbbbbbbbbbbbbbbbbbbbbbbb`
- client `cccccccccccccccccccccccc`
- user `dddddddddddddddddddddddd`
- basic key/secret: `lab_golden_key_00000000000000000001` / `lab_golden_secret_000000000000000001`
- user/password: `lab-golden@example.invalid` / `LabGolden123!`

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

## Native GET rollout (ADR 0014)

| Stage | Where | Flags |
|-------|-------|-------|
| 1 Lab-only | `ll-modern` | all `ENABLE_NATIVE_*_ROUTER=true` |
| 1 Oracle | `ll-legacy` | all `false` (restify) |
| 2 Canary | non-prod modern serving UI | `true`, with off-switch |
| 3 Default on | deployment defaults | `true` after soak |

`start-core.sh` with `STACK=modern` (or hostname `*modern*`) applies
`lab/env/app.env.overlay.modern-native-get` after the base overlay. Code defaults
stay `false`. Dual-run orchestrators keep modern flags on unless
`KEEP_MODERN_NATIVE_ON=0`.

## Native GET flag-on dual-run

```bash
# On each host, or via workstation orchestrator:
BRANCH=master bash lab/scripts/dual-run-native-get.sh
```

Same HTTP status per path is the pass criterion (client basic auth; 403 is OK if both sides match).

## Organisation JWT body-parity dual-run

```bash
BRANCH=master bash lab/scripts/dual-run-org-jwt-get.sh
```

The orchestrator authenticates the synthetic user, exchanges its user token for an
organisation token, and requests the same scoped fixtures from restify (legacy,
flags off) and native handlers (modern, flags on). Every endpoint must return
HTTP 200 with equal response kind, item count, and canonical SHA-256 body hash.
Canonicalization sorts keys/arrays and removes timestamps, password/reset data,
and transient authentication fields.

## Reports

JSON under `lab/reports/` (gitignored). Summarize outcomes in `docs/lab/dual-run-findings.md`.
