#!/usr/bin/env node
/**
 * Rebuild exceptions inventory; preserve non-ok statuses and known overrides.
 * @ll-compat-audit: ok 2026-08-01
 */
const fs = require('fs');
const {
  EXCEPTIONS_DOC,
  gitLsFiles,
  parseNewPrefixes,
  isNewPath,
  isExceptionFile,
  isMarkableFile,
} = require('./compat-audit-lib');

const OVERRIDES = {
  'package.json': 'adapt:A001',
  '.nvmrc': 'adapt:A005',
};

const newPrefixes = parseNewPrefixes();
let doc = fs.readFileSync(EXCEPTIONS_DOC, 'utf8');
const prev = { ...OVERRIDES };
for (const m of doc.matchAll(/\| `([^`]+)` \| ([^|\n]+) \|/g)) {
  const st = m[2].trim();
  if (st && st !== 'ok') prev[m[1]] = st;
}

const files = gitLsFiles().filter((f) => {
  if (isNewPath(f, newPrefixes)) return false;
  if (isExceptionFile(f)) return true;
  if (!isMarkableFile(f)) return true;
  return false;
}).sort();

const rows = files.map((f) => `| \`${f}\` | ${prev[f] || 'ok'} |`);
const table = [
  '| Path | Status |',
  '|------|--------|',
  ...rows,
  '',
  `_Count: ${files.length}_`,
].join('\n');

doc = doc.replace(
  /<!-- BEGIN_INVENTORY -->[\s\S]*?<!-- END_INVENTORY -->/,
  `<!-- BEGIN_INVENTORY -->\n${table}\n<!-- END_INVENTORY -->`
);
fs.writeFileSync(EXCEPTIONS_DOC, doc);
console.log(`Wrote ${files.length} exception rows; overrides=${Object.keys(prev).filter((k) => prev[k] !== 'ok').length}`);
