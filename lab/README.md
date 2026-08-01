# Learning Locker migration lab

Two libvirt VMs on `home-server` (`192.168.168.110`) for strangler modernization and differential testing.

## Hosts

| Alias | IP | Role | Baseline runtime |
|---|---|---|---|
| `ll-legacy` | `192.168.122.110` | Behavior oracle | Node 10 (container), Mongo 4.2 RS, Redis 4 |
| `ll-modern` | `192.168.122.111` | Migration target | Node 20 LTS, Mongo 7 RS, Redis 7 |

### Node version note (A005)

Repo `.nvmrc` stays **`10`** for upstream Learning Locker parity and the legacy
oracle path (`ll-node10-exec`). Lab **modern** deliberately runs **Node 20** via
`lab/scripts/install-node.sh` (`STACK=modern`). Do not assume `nvm use` on a
developer laptop matches the modern VM; use the stack installers / overlays.

SSH from the Windows workstation:

```bash
ssh ll-legacy
ssh ll-modern
```

Both jump via `home-server` using `~/.ssh/laptop_key`.

## Layout on each VM

```text
/opt/learninglocker/
  app/                 # this fork
  xapi-service/        # LearningLocker/xapi-service
  infra/               # compose + helper scripts synced from lab/
```

## Bootstrap

Supported **host OS**: Debian **12/13**, Ubuntu **22.04/24.04**.

```bash
cd /opt/learninglocker/app
# optional explicit deps step (also invoked by bootstrap-vm.sh):
sudo -E bash lab/scripts/install-host-deps.sh
STACK=legacy sudo -E bash lab/scripts/bootstrap-vm.sh   # on ll-legacy
STACK=modern sudo -E bash lab/scripts/bootstrap-vm.sh   # on ll-modern
STACK=legacy bash lab/scripts/install-node.sh
STACK=modern bash lab/scripts/install-node.sh
```

`install-host-deps.sh` installs `docker` + `docker compose`, `rsync`, `curl`,
`openssl`, `git`, and build tools. `install-node.sh` (modern) uses the
NodeSource **nodistro** Node 20 apt repo (Debian 13–safe GPG keyring).

Legacy app commands run through `ll-node10-exec` because Ubuntu 24.04 / Debian
12+ cannot host Node 10 natively.

Install dependencies with engine ignore (upstream `@learninglocker/persona-service` still declares Node 6-8).

Legacy also needs `--ignore-scripts` because ancient `grpc@1.9.1` prebuilds are gone (HTTP 403) and its install script exits non-zero even after source compile. Lab uses `QUEUE_PROVIDER=REDIS`, so Pub/Sub gRPC is not required for the core path:

```bash
# legacy
cd /opt/learninglocker/app
ll-node10-exec 'yarn install --frozen-lockfile --ignore-engines --ignore-scripts'

# modern (currently blocked by native grpc on Node 20 — see docs/lab/baseline-findings.md)
cd /opt/learninglocker/app
yarn install --frozen-lockfile --ignore-engines
```

## Application env

Copy templates, never commit real secrets:

```bash
cp /opt/learninglocker/app/.env.example /opt/learninglocker/app/.env
cp /opt/learninglocker/xapi-service/.env.example /opt/learninglocker/xapi-service/.env
# then apply lab overlays from lab/env/*.env.overlay
```

Generate `APP_SECRET` locally:

```bash
openssl rand -hex 32
```

## Host firewall note

`virbr0` NAT for the lab is applied by `/usr/local/sbin/ll-lab-nft.sh` and `ll-lab-nft.service` on `home-server`.

## Dual-run golden path

See `docs/lab/dual-run.md`. Short form on a VM:

```bash
cd /opt/learninglocker/app
BRANCH=feat/lab-dual-run-golden-path bash lab/scripts/sync-app-branch.sh
STACK=modern bash lab/scripts/build-core.sh   # or STACK=legacy
bash lab/scripts/start-core.sh
bash lab/scripts/ensure-golden-fixtures.sh
HOST_LABEL=$(hostname) bash lab/scripts/golden-path.sh
```

From the workstation (both VMs):

```bash
bash lab/scripts/dual-run-golden.sh
```

## Safety

- Do not modify existing host VMs (`omr-client`, `Haiku`) or production data.
- Use synthetic fixtures only until parity reports are green.
- Keep compatibility freeze in `docs/contracts/compatibility-freeze.md`.
