#!/usr/bin/env node
/**
 * Stamp @ll-compat-audit markers onto markable non-NEW files.
 * Usage:
 *   node lab/scripts/compat-audit-stamp.js --prefix=api/ --status='ok 2026-08-01'
 *   node lab/scripts/compat-audit-stamp.js --file=path --status='adapt:A001' --force
 * @ll-compat-audit: ok 2026-08-01
 */
const fs = require('fs');
const path = require('path');
const {
  ROOT,
  gitLsFiles,
  parseNewPrefixes,
  isNewPath,
  isMarkableFile,
  insertMarker,
  MARKER_RE,
} = require('./compat-audit-lib');

function arg(name, def) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}

const prefix = arg('prefix', '');
const onlyFile = arg('file', '');
const status = arg('status', 'ok 2026-08-01');
const dry = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const newPrefixes = parseNewPrefixes();
let files = onlyFile
  ? [onlyFile]
  : gitLsFiles().filter((f) => (!prefix || f.startsWith(prefix)));

files = files.filter((f) => isMarkableFile(f) && !isNewPath(f, newPrefixes));

function stripMarker(content) {
  return content
    .replace(/^[ \t]*\/\/[ \t]*@ll-compat-audit:[^\n]*\r?\n/m, '')
    .replace(/^[ \t]*\/\*[ \t]*@ll-compat-audit:[^*]*\*\/[ \t]*\r?\n/m, '')
    .replace(/^[ \t]*<!--[ \t]*@ll-compat-audit:[^>]*-->[ \t]*\r?\n/m, '')
    .replace(/\r?\n[ \t]*\/\/[ \t]*@ll-compat-audit:[^\n]*/g, '')
    .replace(/\r?\n[ \t]*\/\*[ \t]*@ll-compat-audit:[^*]*\*\//g, '')
    .replace(/\r?\n[ \t]*<!--[ \t]*@ll-compat-audit:[^>]*-->/g, '');
}

let changed = 0;
let skipped = 0;
for (const file of files) {
  const full = path.join(ROOT, file);
  let content = fs.readFileSync(full, 'utf8');
  if (MARKER_RE.test(content)) {
    if (!force) {
      skipped += 1;
      continue;
    }
    content = stripMarker(content);
  }
  const result = insertMarker(content, file, status);
  if (!result.changed) {
    skipped += 1;
    continue;
  }
  if (!dry) fs.writeFileSync(full, result.content);
  changed += 1;
  console.log(`${dry ? 'DRY ' : ''}STAMP ${file}`);
}
console.log(JSON.stringify({ changed, skipped, status, prefix: prefix || onlyFile || '(all)' }));
