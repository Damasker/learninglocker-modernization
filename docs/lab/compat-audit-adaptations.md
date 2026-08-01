# Compat audit — adaptations backlog

Items found during the 1A+2B file audit. Execute status updated 2026-08-01.

| ID | Path(s) | Symptom | Proposed fix | Freeze risk | Status |
|----|---------|---------|--------------|-------------|--------|
| A001 | `package.json` (husky `post-checkout`), `clean-build-cache.sh` | `yarn clean-cache` wipes `*/dist` on every `git checkout` / lab sync | Honor `LL_SKIP_CLEAN_CACHE=1` in `clean-build-cache.sh`; lab `sync-app-branch.sh` defaults it on | Low (ops) | **done** |
| A002 | `api/src/controllers/DownloadController.js`, `lib/services/files/downloadLogo.js` | Missing `org.logo` → 500 on `GET /downloadlogo/:org` | Guard null logo → `NotFoundError` 404 | Low | **done** |
| A003 | `lab/scripts/ensure-golden-fixtures.sh` (user scopes) | Org JWT `all` cannot edit statement metadata (needs `xapi/all` / `statements/write`) | Documented in `docs/lab/dual-run.md`; smoke keeps client-basic | Low | **done** |
| A004 | `api/src/routes/personas/personaRESTHandler.js` | Duplicate identical `POST /mergepersona` mounts | Removed duplicate route registration | None | **done** |
| A005 | `.nvmrc` | Still `10` while lab modern runs Node 20 | Documented dual-runtime in `lab/README.md` + root `README.md`; `.nvmrc` kept at 10 | Low | **done** |
| A006 | `api/src/controllers/StatementMetadataController.js` | Null `model` after update → crash if id missing/out of scope | Guard `if (!model) throw NotFoundError` | Low | **done** |
| A007 | `lib/helpers/cursor.js`, `lib/helpers/statementForwarding.js` | Deprecated `new Buffer(...)` (Node 20 DEP0005) | Replaced with `Buffer.from` | None | **done** |

## Batch review notes (2026-08-01)

See git history / prior audit commit. Gap criterion remains:

`node lab/scripts/compat-audit-gap.js` → `COMPAT_AUDIT_GAP_OK` (0 gaps).
