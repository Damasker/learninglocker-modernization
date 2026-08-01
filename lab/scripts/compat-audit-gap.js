#!/usr/bin/env node
/**
 * List tracked files that still need a compat audit marker.
 * Usage: node lab/scripts/compat-audit-gap.js [--prefix=ui/]
 * Exit 1 if any gaps.
 * @ll-compat-audit: ok 2026-08-01
 */
const {
  gitLsFiles,
  parseNewPrefixes,
  isNewPath,
  isExceptionFile,
  isMarkableFile,
  hasMarker,
} = require('./compat-audit-lib');

const prefixArg = process.argv.find((a) => a.startsWith('--prefix='));
const prefix = prefixArg ? prefixArg.slice('--prefix='.length) : '';

const newPrefixes = parseNewPrefixes();
const files = gitLsFiles().filter((f) => (!prefix || f.startsWith(prefix)));

const gaps = [];
const skippedNew = [];
const skippedExc = [];
const marked = [];

for (const file of files) {
  if (isNewPath(file, newPrefixes)) {
    skippedNew.push(file);
    continue;
  }
  if (isExceptionFile(file) || !isMarkableFile(file)) {
    // Non-markable non-new must be covered by exceptions inventory sync;
    // gap only cares about markable unmarked files.
    if (!isMarkableFile(file)) {
      skippedExc.push(file);
      continue;
    }
  }
  if (!isMarkableFile(file)) {
    skippedExc.push(file);
    continue;
  }
  if (hasMarker(file)) {
    marked.push(file);
    continue;
  }
  gaps.push(file);
}

console.log(JSON.stringify({
  prefix: prefix || '(all)',
  marked: marked.length,
  new: skippedNew.length,
  exceptionOrNonMarkable: skippedExc.length,
  gaps: gaps.length,
}, null, 2));

if (gaps.length) {
  console.error('COMPAT_AUDIT_GAPS');
  gaps.forEach((g) => console.error(g));
  process.exit(1);
}
console.log('COMPAT_AUDIT_GAP_OK');
