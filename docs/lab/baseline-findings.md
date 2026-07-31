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
   - Source compile is flaky under yarn install scripts
   - Modern Node 20 cannot build this native addon at all
3. Legacy baseline workaround (Redis-only queues):
   - `yarn install --frozen-lockfile --ignore-engines --ignore-scripts`
   - Core requires verified: express, mongoose, bull, ioredis, passport, dotenv
   - `@google-cloud/pubsub` skipped until foundation replaces gRPC stack
4. Therefore modern host cannot yet `yarn install` the unmodified lockfile.
   - This confirms foundation work must replace/remove legacy Pub/Sub gRPC path before Node 20 runtime.

## Verified on 2026-07-29

| Check | ll-legacy | ll-modern |
|---|---|---|
| Mongo RS + Redis healthy | yes | yes |
| Env overlays + APP_SECRET | yes | yes |
| Node runtime | 10 via Docker helper | 20.20.2 native |
| yarn install core path | yes (`--ignore-scripts`) | blocked (grpc/node-gyp) |
| Core Node requires | yes | n/a until deps install |
