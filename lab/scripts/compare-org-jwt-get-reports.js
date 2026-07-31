#!/usr/bin/env node

const path = require('path');

const left = require(path.resolve(process.argv[2]));
const right = require(path.resolve(process.argv[3]));
const leftByPath = new Map(left.results.map(result => [result.path, result]));
const rightByPath = new Map(right.results.map(result => [result.path, result]));
const paths = [...new Set([...leftByPath.keys(), ...rightByPath.keys()])].sort();

let failures = 0;
console.log(`compare ${left.host}/${left.nativeMode} vs ${right.host}/${right.nativeMode}`);

paths.forEach((requestPath) => {
  const leftResult = leftByPath.get(requestPath);
  const rightResult = rightByPath.get(requestPath);
  const statusOk = leftResult && rightResult &&
    leftResult.status === 200 &&
    rightResult.status === 200;
  const bodyOk = statusOk &&
    leftResult.kind === rightResult.kind &&
    leftResult.count === rightResult.count &&
    leftResult.hash === rightResult.hash;
  const ok = statusOk && bodyOk;

  if (!ok) failures += 1;
  console.log(
    `${ok ? 'PASS' : 'DIFF'} ${requestPath}: ` +
    `${leftResult ? `${leftResult.status}/${leftResult.count}/${leftResult.hash}` : 'missing'} -> ` +
    `${rightResult ? `${rightResult.status}/${rightResult.count}/${rightResult.hash}` : 'missing'}`
  );
});

if (failures > 0) {
  console.log(`ORG_JWT_BODY_COMPARE_FAIL (${failures} paths)`);
  process.exit(1);
}

console.log('ORG_JWT_BODY_COMPARE_OK');
