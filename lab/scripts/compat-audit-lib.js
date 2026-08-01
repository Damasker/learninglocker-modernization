#!/usr/bin/env node
/**
 * Compat audit helpers: NEW prefixes, exception extensions, marker detection.
 * @ll-compat-audit: ok 2026-08-01
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');
const NEW_PATHS_DOC = path.join(ROOT, 'docs/lab/compat-audit-new-paths.md');
const EXCEPTIONS_DOC = path.join(ROOT, 'docs/lab/compat-audit-exceptions.md');

const MARKER_RE = /@ll-compat-audit:\s*(ok|adapt:[A-Za-z0-9_-]+|skip:[^\s]+)/;

const EXCEPTION_EXTS = new Set([
  '.json', '.yml', '.yaml', '.lock',
  '.png', '.gif', '.ico', '.svg', '.woff', '.woff2', '.eot', '.ttf',
  '.csv', '.snap', '.dist',
  '.overlay', '.legacy-restify', '.modern-native-get',
  '.nvmrc', '.yarnrc', '.eslintignore', '.editorconfig', '.gitattributes', '.gitkeep',
  '.babelrc', '.eslintrc',
]);

const MARKABLE_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.sh', '.md', '.css', '.html', '.babel',
]);

function gitLsFiles() {
  const out = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' });
  return out.split(/\r?\n/).filter(Boolean);
}

function parseNewPrefixes() {
  const text = fs.readFileSync(NEW_PATHS_DOC, 'utf8');
  const section = text.match(/## Prefixes\r?\n([\s\S]*?)\r?\n## /);
  if (!section) return [];
  return section[1]
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('```') && !l.startsWith('#') && !l.startsWith('_'));
}

function isNewPath(file, prefixes) {
  return prefixes.some((p) => (p.endsWith('/') ? file.startsWith(p) : file === p));
}

function extOf(file) {
  const base = path.basename(file);
  if (base.startsWith('.') && !base.includes('.', 1)) {
    return base; // .nvmrc
  }
  const ext = path.extname(file).toLowerCase();
  return ext || '';
}

function isExceptionFile(file) {
  const ext = extOf(file);
  if (EXCEPTION_EXTS.has(ext)) return true;
  if (file.endsWith('.example') || file.endsWith('.json.dist')) return true;
  const base = path.basename(file);
  // Unknown bare / odd files without markable ext → exception inventory
  if (!ext && base !== 'LICENSE') return true;
  return false;
}

function isMarkableFile(file) {
  const ext = extOf(file);
  if (MARKABLE_EXTS.has(ext)) return true;
  if (file.endsWith('.babel')) return true;
  if (path.basename(file) === 'LICENSE') return true;
  return false;
}

function hasMarker(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return false;
  const buf = fs.readFileSync(full);
  // skip huge / binary sniff
  if (buf.includes(0)) return false;
  const text = buf.toString('utf8');
  return MARKER_RE.test(text);
}

function commentStyle(file) {
  const ext = extOf(file).toLowerCase();
  if (ext === '.md' || path.basename(file) === 'LICENSE') {
    return 'html';
  }
  if (ext === '.css' || ext === '.html') {
    return ext === '.html' ? 'html' : 'css';
  }
  return 'line'; // js/ts/sh/babel
}

function makeMarker(status, style) {
  const body = `@ll-compat-audit: ${status}`;
  if (style === 'html') return `<!-- ${body} -->`;
  if (style === 'css') return `/* ${body} */`;
  return `// ${body}`;
}

function insertMarker(content, file, status) {
  if (MARKER_RE.test(content)) return { content, changed: false };
  const style = commentStyle(file);
  const marker = makeMarker(status, style);
  const lines = content.split(/\r?\n/);
  let idx = 0;
  if (lines[0] && lines[0].startsWith('#!')) idx = 1;
  // Keep leading license block comments intact for JS
  if (style === 'line' && lines[idx] && lines[idx].trim().startsWith('/*')) {
    let j = idx;
    while (j < lines.length && !lines[j].includes('*/')) j += 1;
    if (j < lines.length) idx = j + 1;
  }
  // For md: after first heading if present
  if (style === 'html' && lines[0] && lines[0].startsWith('#')) {
    idx = 1;
  }
  lines.splice(idx, 0, marker);
  return { content: lines.join('\n'), changed: true };
}

module.exports = {
  ROOT,
  NEW_PATHS_DOC,
  EXCEPTIONS_DOC,
  MARKER_RE,
  EXCEPTION_EXTS,
  MARKABLE_EXTS,
  gitLsFiles,
  parseNewPrefixes,
  isNewPath,
  extOf,
  isExceptionFile,
  isMarkableFile,
  hasMarker,
  commentStyle,
  makeMarker,
  insertMarker,
};
