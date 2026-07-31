#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error('Usage: canonical-json-report.js <response-body>');
}

const body = fs.readFileSync(sourcePath, 'utf8');
const omittedKeys = new Set([
  '__v',
  'createdAt',
  'updatedAt',
  'authLastAttempt',
  'authFailedAttempts',
  'authLockoutExpiry',
  'password',
  'passwordHistory',
  'resetTokens',
  'completedQueues',
  'processingQueues',
  'pendingForwardingQueue',
  'completedForwardingQueue',
  'deadForwardingQueue',
  'failedForwardingLog',
  'startedAt',
  'completedAt',
]);

const canonicalize = (value) => {
  if (Array.isArray(value)) {
    return value
      .map(canonicalize)
      .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .filter(key => !omittedKeys.has(key))
      .sort()
      .reduce((result, key) => ({
        ...result,
        [key]: canonicalize(value[key]),
      }), {});
  }

  return value;
};

let value;
let kind = 'text';
try {
  value = JSON.parse(body);
  kind = Array.isArray(value) ? 'array' : 'object';
} catch (err) {
  value = body;
}

const canonical = JSON.stringify(canonicalize(value));
const report = {
  kind,
  count: Array.isArray(value) ? value.length : (kind === 'object' ? 1 : 0),
  bytes: Buffer.byteLength(body),
  hash: crypto.createHash('sha256').update(canonical).digest('hex'),
};

process.stdout.write(JSON.stringify(report));
