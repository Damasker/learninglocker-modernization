# ADR 0001: Modernize via strangler, keep Mongo

## Status

Accepted

## Context

Learning Locker 2 is a management/analytics layer over MongoDB and Redis. The xAPI HTTP surface lives in a separate service (`LearningLocker/xapi-service`). Statement documents, aggregation pipelines, auth scopes, Redis notify channels, and queue names form a hard compatibility boundary.

A Rails/Postgres rewrite would force a second migration of document shape, indexes, void/hash semantics, and aggregation APIs. That conflicts with the goal of a modern core LRS with minimum risk.

## Decision

1. Modernize this fork with a strangler approach on Node.js LTS + TypeScript.
2. Keep MongoDB as the system of record for statements and related LRS data.
3. Keep Redis contracts for notify/cache/queues until dual-run parity exists.
4. Treat `xapi-service` as part of the same compatibility unit.
5. Use two lab VMs (`ll-legacy`, `ll-modern`) for differential testing before production cutover.
6. Do not put xAPI statements into Postgres as a first step.

## Consequences

### Positive

- Existing statement documents remain readable without a shape migration.
- Contract tests and golden paths can compare legacy vs modern behavior.
- Risk is localized to process boundaries (worker, API, shared kernel).

### Negative

- Temporary dual-stack operational cost (two VMs, two runtimes).
- `@learninglocker/*` packages likely need vendoring/forking for modern Node.
- Full UI rewrite remains deferred and can lag behind API/worker.

## Alternatives considered

- Rails + Postgres LRS rewrite — rejected due to aggregation and data-preservation risk.
- Rails + Mongoid façade — acceptable only if Ruby is an organizational constraint; not chosen.
- Big-bang rewrite of API + worker + UI + xAPI — rejected as highest regression risk.
