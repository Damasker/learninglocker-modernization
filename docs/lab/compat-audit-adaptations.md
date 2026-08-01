# Compat audit — adaptations backlog

Items found during the 1A+2B file audit. **Do not implement here** until a
follow-up execute pass is approved per id.

| ID | Path(s) | Symptom | Proposed fix | Freeze risk | Status |
|----|---------|---------|--------------|-------------|--------|
| A001 | `package.json` (husky `post-checkout`), `clean-build-cache.sh` | `yarn clean-cache` wipes `*/dist` on every `git checkout` / lab sync | Honor `LL_SKIP_CLEAN_CACHE=1` in hook/script; document rebuild in `sync-app-branch.sh` | Low (ops) | open |
| A002 | `api/src/controllers/DownloadController.js`, `lib/services/files/downloadLogo.js` | Missing `org.logo` → 500 on `GET /downloadlogo/:org` | Guard null logo → 404 | Low | open |
| A003 | `lab/scripts/ensure-golden-fixtures.sh` (user scopes) | Org JWT `all` cannot edit statement metadata (needs `xapi/all` / `statements/write`) | Keep client-basic for metadata smoke; optionally document in dual-run.md | Low | open |
| A004 | `api/src/routes/personas/personaRESTHandler.js` | Duplicate identical `POST /mergepersona` mounts | Remove duplicate route registration | None | open |
| A005 | `.nvmrc` | Still `10` while lab modern runs Node 20 | Document dual-runtime in README/lab; leave `.nvmrc=10` for upstream parity or add note file | Low | open |
| A006 | `api/src/controllers/StatementMetadataController.js` | Null `model` after update → crash if id missing/out of scope | Guard `if (!model) return 404` | Low | open |
| A007 | `lib/helpers/cursor.js`, `lib/helpers/statementForwarding.js` | Deprecated `new Buffer(...)` (Node 20 DEP0005) | Replace with `Buffer.from` / `Buffer.alloc` | None | open |

## Batch review notes (2026-08-01)

### Batch 1 — root / `.github` / lab / docs

- Lab + docs ADR/contracts/api are **NEW** (no markers).
- Root markable files stamped; `package.json` / `.nvmrc` / lock / json pm2 → exceptions.
- Husky clean-cache + `.nvmrc` recorded as A001 / A005.

### Batch 2 — NEW kernel + native routers

- 163 NEW files via prefixes (64 `lib/kernel`, 43 `lab`, native route dirs, docs).
- Persona mongoose Mongo7 wiring lives under NEW `lib/kernel/persona/`.

### Batch 3 — `api/` remainder

- `HttpRoutes.js` dual-gates for native flags reviewed → `ok`.
- Download / statement metadata / mergepersona → A002 / A006 / A004.

### Batch 4 — `lib/` remainder

- Queue/notify contracts untouched; persona facade via kernel.
- Deprecated Buffer helpers → A007.

### Batch 5 — `worker/` + `cli/`

- Worker/CLI stamp `ok`; no additional adapt items beyond shared lib Buffer (A007).

### Batch 6 — `ui/`

- Dart Sass already replaced `node-sass` (baseline findings); UI sources stamped `ok`.
- Assets/snaps in exceptions inventory.

## Gap criterion

`node lab/scripts/compat-audit-gap.js` → `COMPAT_AUDIT_GAP_OK` (0 gaps).
