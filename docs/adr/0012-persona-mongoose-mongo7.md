# ADR 0012: Persona Mongo access via mongoose (Mongo 7 / no OP_QUERY)

## Status

Accepted

## Context

Dual-run on `ll-modern` (MongoDB 7) failed persona extract with:

```text
MongoError: Unsupported OP_QUERY command: find.
```

`@learninglocker/persona-service@1.7.1` connects with `mongodb@^2.2`, which still uses the legacy OP_QUERY opcode removed in MongoDB 5.1+. The Learning Locker app already talks to Mongo through mongoose 5 (mongodb driver 3.x), which uses modern commands.

## Decision

1. Replace persona-service's `createMongoClient` at the kernel boundary (`lib/kernel/persona/createMongoClient.js`) with a factory that returns the native `Db` from the shared mongoose connection.
2. Keep `mongoModelsRepo` and persona service APIs unchanged.
3. Do not bump the root `mongodb@2` dependency in this change (ObjectID imports remain); wire-protocol traffic for persona collections goes through mongoose's driver.

## Consequences

### Positive

- Persona extract works on MongoDB 7 without forking persona-service.
- One connection pool for app + persona data.

### Negative

- Kernel now owns the persona DB wiring; upgrading persona-service later must preserve this seam.
- ObjectID values still constructed via root `mongodb@2` BSON helpers (compatible in practice with mongoose's driver).
