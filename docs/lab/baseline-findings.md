# Lab baseline findings (2026-07-29)

## Working

- Dual VMs reachable via `ssh ll-legacy` / `ssh ll-modern`
- Mongo replica set `rs0` + Redis healthy on both
- Env overlays applied; `APP_SECRET` generated per host (not in git)
- Node 20 + yarn + pm2 on modern
- Node 10 helper (`ll-node10-exec`) on legacy

## Baseline dependency blockers

1. `@learninglocker/persona-service@1.7.1` declares engines `6-8` while app `.nvmrc` is `10`.
   - Mitigation: `yarn install --ignore-engines`
2. The original lockfile pulled native `grpc` through both `@google-cloud/pubsub` and `pkgcloud`.
   - Prebuilt binaries return HTTP 403
   - Node 20 cannot build these native addons
3. The original UI toolchain used `node-sass@4`, which cannot build on Node 20.
4. Legacy baseline workaround (Redis-only queues):
   - `yarn install --frozen-lockfile --ignore-engines --ignore-scripts`
   - Core requires verified: express, mongoose, bull, ioredis, passport, dotenv

## Foundation outcome

- `@google-cloud/pubsub` upgraded to 5.x (`@grpc/grpc-js`, no native gRPC)
- `pkgcloud` upgraded to 2.x; native `grpc` is absent from `yarn.lock`
- Queue providers load lazily, so Redis deployments do not initialize cloud SDKs
- `node-sass` replaced by Dart Sass with the Webpack 3-compatible `sass-loader@7`
- Clean Node 20 install succeeds; only optional old New Relic native metrics reports a non-fatal build warning
- API production bundle succeeds on Node 20 and returns HTTP 200 from `/`

## Verified on 2026-07-29

| Check | ll-legacy | ll-modern |
|---|---|---|
| Mongo RS + Redis healthy | yes | yes |
| Env overlays + APP_SECRET | yes | yes |
| Node runtime | 10 via Docker helper | 20.20.2 native |
| yarn install core path | yes (`--ignore-scripts`) | yes (normal scripts) |
| Queue regression tests | 2 passing | 2 passing |
| API production build | yes | yes |
| API `/` smoke | not re-run after foundation | HTTP 200 |
