/**
 * sync_examples.js — copies .typort examples from the elaboration-zoo-lsp submodule
 * into a web-accessible directory for the extension to fetch at runtime,
 * then updates extension.js with the current file list.
 *
 * Usage: node sync_examples.js
 *
 * Workflow:
 *   1. Add .typort files to elaboration-zoo-lsp/examples/
 *   2. git submodule update --remote  (pull latest)
 *   3. node sync_examples.js
 *   4. Commit + push
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'elaboration-zoo-lsp', 'examples');
const DST_DIR = path.join(__dirname, 'sample', 'myExt', 'examples');
const EXT_JS = path.join(__dirname, 'sample', 'myExt', 'extension.js');

// Ensure destination exists
fs.mkdirSync(DST_DIR, { recursive: true });

// Read source files
if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`);
  console.error('Make sure the elaboration-zoo-lsp submodule is initialized.');
  process.exit(1);
}

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.typort')).sort();

if (files.length === 0) {
  console.warn('No .typort files found in', SRC_DIR);
  process.exit(0);
}

// 1. Copy .typort files to web-accessible directory
let copied = 0;
for (const file of files) {
  const src = path.join(SRC_DIR, file);
  const dst = path.join(DST_DIR, file);
  fs.copyFileSync(src, dst);
  copied++;
  console.log(`  ✓ sync ${file}`);
}

// Also copy test.typort from root if present
const testFile = path.join(__dirname, 'test.typort');
if (fs.existsSync(testFile)) {
  fs.copyFileSync(testFile, path.join(DST_DIR, 'test.typort'));
  console.log('  ✓ sync test.typort (root)');
  copied++;
}

// 2. Update extension.js with the current file list
const extJs = fs.readFileSync(EXT_JS, 'utf-8');

// The file list is in the activation call: .seed(['file1.typort', 'file2.typort'])
const oldListMatch = extJs.match(/\.seed\(\[([^\]]+)\]\)/);
if (!oldListMatch) {
  console.error('Could not find .seed([...]) call in extension.js');
  process.exit(1);
}

const newList = files.map(f => `'${f}'`).join(', ');
const oldListStr = oldListMatch[1];
const newListStr = newList;

if (oldListStr === newListStr) {
  console.log('\n  ✓ file list unchanged');
} else {
  const updated = extJs.replace(`.seed([${oldListStr}])`, `.seed([${newListStr}])`);
  fs.writeFileSync(EXT_JS, updated, 'utf-8');
  copied++;
  console.log(`\n  ✓ extension.js: updated example list (${files.length} file(s))`);
}

console.log(`\nDone! ${copied} file(s) processed.`);
