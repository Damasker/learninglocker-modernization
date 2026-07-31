# ADR 0014: Staged rollout for native `/v2` routers

## Status

Accepted — stages 1–3 live in lab (`ll-modern` native default-on;
`ll-legacy` restify oracle)

## Context

All restify `/v2` models have feature-flagged native routers (ADRs 0005–0017),
including writes. Lab dual-run proved GET status/body parity and write status
parity (dashboard, user, statement/batchdelete). Canary UI on `ll-modern`
exercises the native path continuously.

Code defaults remain `false` so non-lab deploys stay opt-in. Lab deployment
defaults flip to native on (stage 3) while dual-run keeps an explicit restify
oracle overlay for legacy.

## Decision

Roll out native flags in three stages:

1. **Lab-only (`ll-modern`)** — `ENABLE_NATIVE_*_ROUTER=true` via
   `app.env.overlay.modern-native-get`. `ll-legacy` stays restify.
2. **Canary** — same flags on `ll-modern` with UI
   (`build-ui.sh` / `start-ui.sh`).
3. **Default on (lab)** — base `lab/env/app.env.overlay` sets all
   `ENABLE_NATIVE_*_ROUTER=true`. `STACK=legacy` applies
   `lab/env/app.env.overlay.legacy-restify` (all `false`) so dual-run oracle
   stays restify. Code/.env.example defaults stay `false`.

`start-core.sh` / `start-ui.sh` detect `STACK` from env or hostname
(`*modern*` / `*legacy*`) and apply the matching stack overlay after the base
overlay.

## Consequences

### Positive

- Modern lab and canary UI default to native CRUD without manual flag toggles.
- Legacy dual-run oracle remains a one-overlay flip away (`STACK=legacy`).
- Non-lab installs remain opt-in via unset/false code defaults.

### Negative

- Operators must use `STACK=legacy` (or hostname) when restarting core on
  `ll-legacy`, otherwise base overlay would enable native there too.
