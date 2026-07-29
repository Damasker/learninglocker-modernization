# Learning Locker migration lab

Two libvirt VMs on `home-server` (`192.168.168.110`) for strangler modernization and differential testing.

## Hosts

| Alias | IP | Role | Baseline runtime |
|---|---|---|---|
| `ll-legacy` | `192.168.122.110` | Behavior oracle | Node 10 (container), Mongo 4.2 RS, Redis 4 |
| `ll-modern` | `192.168.122.111` | Migration target | Node 20 LTS, Mongo 7 RS, Redis 7 |

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

## Start infrastructure

```bash
cd /opt/learninglocker/infra
sudo docker compose -p ll up -d
./init-replica.sh
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

## Safety

- Do not modify existing host VMs (`omr-client`, `Haiku`) or production data.
- Use synthetic fixtures only until parity reports are green.
- Keep compatibility freeze in `docs/contracts/compatibility-freeze.md`.
