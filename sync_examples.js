/**
 * sync_examples.js — embeds the latest .typort example content from the
 * elaboration-zoo-lsp submodule directly into extension.js as the nrsFile
 * template literal.
 *
 * Usage: node sync_examples.js
 *
 * Workflow:
 *   1. Edit .typort files in elaboration-zoo-lsp/examples/
 *   2. git submodule update --remote  (pull latest from upstream)
 *   3. node sync_examples.js          (embed into extension.js)
 *   4. Commit + push
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'elaboration-zoo-lsp', 'examples');
const EXT_JS = path.join(__dirname, 'sample', 'myExt', 'extension.js');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`);
  console.error('Make sure the elaboration-zoo-lsp submodule is initialized.');
  process.exit(1);
}

// Find the first .typort file to use as nrsFile content
const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.typort')).sort();
if (files.length === 0) {
  console.warn('No .typort files found in', SRC_DIR);
  process.exit(0);
}

// Read the first .typort file as the new nrsFile content
const srcPath = path.join(SRC_DIR, files[0]);
const newContent = fs.readFileSync(srcPath, 'utf-8');

// Read extension.js
let extJs = fs.readFileSync(EXT_JS, 'utf-8');

// Find the nrsFile template literal boundaries
const nrsStartMarker = '(e.nrsFile =';
const nrsIdx = extJs.indexOf(nrsStartMarker);
if (nrsIdx === -1) {
  console.error('Could not find "(e.nrsFile =" in extension.js');
  process.exit(1);
}

// Find opening backtick
const btOpen = extJs.indexOf('`', nrsIdx);
if (btOpen === -1) {
  console.error('Could not find opening backtick for nrsFile');
  process.exit(1);
}

// Find closing backtick (look for `\n or `\r\n followed by whitespace and ),)
const rest = extJs.slice(btOpen + 1);
const btCloseMatch = rest.match(/`\s*\n\s*\)/);
if (!btCloseMatch) {
  console.error('Could not find closing backtick for nrsFile');
  process.exit(1);
}
const btClose = btOpen + 1 + btCloseMatch.index;

// The content between backticks (exclude the opening backtick, keep the newline after closing backtick for formatting)
const oldContent = extJs.slice(btOpen + 1, btClose);

if (oldContent === '\n' + newContent) {
  console.log('  ✓ nrsFile content unchanged');
} else {
  extJs = extJs.slice(0, btOpen + 1) + '\n' + newContent + extJs.slice(btClose);
  fs.writeFileSync(EXT_JS, extJs, 'utf-8');
  console.log(`  ✓ embedded ${files[0]} (${newContent.length} bytes) into extension.js nrsFile`);
}

console.log('\nDone!');
