/**
 * sync_examples.js — embeds individual .typort example files from the
 * elaboration-zoo-lsp submodule into separate file exports in extension.js.
 *
 * Each .typort file in the submodule becomes a separate MemFS file in the
 * web demo (vscode.dev), instead of being merged into one big nrsFile.
 *
 * Usage: node sync_examples.js
 *
 * Workflow:
 *   1. Edit .typort files in elaboration-zoo-lsp/examples/
 *   2. git submodule update --remote  (pull latest from upstream)
 *   3. node sync_examples.js          (update each file export in extension.js)
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

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.typort')).sort();
if (files.length === 0) {
  console.warn('No .typort files found in', SRC_DIR);
  process.exit(0);
}

/**
 * Escape content for embedding in a JS template literal (backtick string).
 * In JS template literals, these must be escaped:
 *   - backtick (`)  →  \`
 *   - ${            →  \${  (to prevent template expression parsing)
 *   - backslash (\) →  \\   (to prevent escape sequence parsing)
 *
 * Must also call unescapeNoneAscii afterwards for safety.
 */
function escapeForJsTemplate(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

// Read extension.js
let extJs = fs.readFileSync(EXT_JS, 'utf-8');

let changed = 0;

for (const file of files) {
  const filePath = path.join(SRC_DIR, file);
  const newContent = escapeForJsTemplate(
    fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n')
  );

  // Build the export name: e.file_<filename_without_ext>
  const exportName = 'e.file_' + file.replace(/\.typort$/, '');

  // Find the export assignment in extension.js
  const exportStart = extJs.indexOf(`${exportName} =\n            \``);
  if (exportStart === -1) {
    console.error(`  ✗ Could not find export "${exportName}" in extension.js`);
    continue;
  }

  // Find the opening backtick of this template literal
  const btOpenIdx = extJs.indexOf('`', exportStart + exportName.length);
  if (btOpenIdx === -1) {
    console.error(`  ✗ Could not find opening backtick for "${exportName}"`);
    continue;
  }

  // The content starts right after the opening backtick + \n
  const contentStart = btOpenIdx + 2; // skip ` and \n

  // Find closing backtick: `\n followed by whitespace and ),
  const rest = extJs.slice(contentStart);
  const btCloseMatch = rest.match(/`\s*\n\s*\),/);
  if (!btCloseMatch) {
    console.error(`  ✗ Could not find closing backtick for "${exportName}"`);
    continue;
  }
  const btCloseIdx = contentStart + btCloseMatch.index;

  const oldContent = extJs.slice(contentStart, btCloseIdx).replace(/\r\n/g, '\n');

  if (oldContent === newContent) {
    console.log(`  ✓ ${file}: unchanged`);
  } else {
    extJs = extJs.slice(0, contentStart) + '\n' + newContent + '\n' + extJs.slice(btCloseIdx);
    console.log(`  ✓ ${file}: updated (${newContent.length} bytes)`);
    changed++;
  }
}

if (changed > 0) {
  fs.writeFileSync(EXT_JS, extJs, 'utf-8');
  console.log(`\nUpdated ${changed} file(s) in extension.js`);
} else {
  console.log('\nNo changes needed.');
}

console.log('\nDone!');
