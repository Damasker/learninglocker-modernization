# Dual-run findings

## Status

Tooling landed on `feat/lab-dual-run-golden-path`. First live golden-path runs recorded below as they complete.

## Hosts

| Host | Role | App branch target |
|------|------|-------------------|
| `ll-legacy` | behavior oracle | same dual-run branch (Node 10 app via `ll-node10-exec`, xAPI on Node 20) |
| `ll-modern` | migration target | same dual-run branch (Node 20) |

Native GET strangler flags remain **off** for the first pass.

## Results

_Pending first automated run._
