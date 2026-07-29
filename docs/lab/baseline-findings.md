# Lab baseline findings (2026-07-29)

## Working

- Dual VMs reachable via `ssh ll-legacy` / `ssh ll-modern`
- Mongo replica set `rs0` + Redis healthy on both
- Env overlays applied; `APP_SECRET` generated per host (not in git)
- Node 20 + yarn + pm2 on modern
- Node 10 helper (`ll-node10-exec`) on legacy

## Dependency install blockers

1. `@learninglocker/persona-service@1.7.1` declares engines `6-8` while app `.nvmrc` is `10`.
   - Mitigation: `yarn install --ignore-engines`
2. Legacy/modern both pull ancient `grpc@1.9.1` via `@google-cloud/pubsub` / `google-gax`.
   - Prebuilt binaries return HTTP 403
   - Source compile races under yarn parallel install scripts
   - Modern Node 20 cannot build this native addon at all
3. Therefore modern host cannot yet `yarn install` the unmodified lockfile.
   - This confirms foundation work must replace/remove legacy Pub/Sub gRPC path before Node 20 runtime.

## Next baseline actions

1. Finish legacy install with `CHILD_CONCURRENCY=1`
2. Run `yarn test-lib` / API smoke on legacy as oracle
3. Start foundation branch that swaps `@google-cloud/pubsub` optional path and vendors persona-service for modern Node
