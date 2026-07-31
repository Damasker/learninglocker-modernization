# ADR 0014: Staged rollout for native `/v2` GET routers

## Status

Accepted

## Context

All non-Statement restify GET models now have feature-flagged native routers
(ADRs 0005–0013). Lab dual-run proved:

- client-basic status parity (20/20)
- organisation-JWT canonical body parity (20/20)

Code defaults remain `false`. The UI and admin `/v2` GETs can move to native
handlers without waiting for Statement or write stranglers, but traffic flip
must stay staged so restify remains the rollback path.

## Decision

Roll out native GET flags in three stages:

1. **Lab-only (`ll-modern`)** — all `ENABLE_NATIVE_*_ROUTER=true` on the modern
   lab host. `ll-legacy` stays `false` as the restify oracle. Code/.env.example
   defaults stay `false`.
2. **Canary** — enable the same flags on a non-production modern instance that
   serves real UI traffic; keep an off switch and dual-run smoke available.
3. **Default on** — only after canary soak, change lab overlays / deployment
   defaults to `true`. Do not change Statement (still restify) or open writes
   via native routers in this ADR.

Lab automation applies stage 1 via `STACK=modern` +
`lab/env/app.env.overlay.modern-native-get` during `start-core.sh`, and keeps
modern flags on after dual-run scripts complete.

## Consequences

### Positive

- UI on modern lab exercises native GETs continuously.
- Rollback is still a flag flip (`MODE=off`).
- Statement and write paths stay untouched.

### Negative

- Two lab hosts diverge on read path by design until stage 3.
- Operators must remember `STACK=modern` when restarting core on `ll-modern`.
