// slim-extensions.js — remove unused builtin language extensions from the
// vscode-web dist to shrink the web demo payload.
//
// The typort demo only opens .typort files, so the full TS/HTML/Markdown/CSS
// language services (and other big builtins) are never activated. Removing
// them saves ~32MB of dist.
//
// How it works: vscode-web loads local builtin extensions by SCANNING the
// dist/extensions directory at startup — a missing directory is simply not
// registered (vscode tolerates absent builtins). No manifest/registry edit
// is needed (the builtInExtensions array in workbench.web.main.js is only
// for remotely-downloaded extensions like js-debug).
//
// Works on both Windows (local) and Linux (CI). Safe to re-run: deleting an
// already-deleted directory is a no-op.
//
// Usage: node slim-extensions.js  (run from sample/)
const fs = require('fs');
const path = require('path');

const EXT_DIR = path.join(__dirname, 'depend', 'vscode-web', 'dist', 'extensions');

// Extensions to remove (dir name == extension id).
const REMOVE = [
  'typescript-language-features', // 16M — tsserver language service
  'html-language-features',       // 7.1M
  'markdown-language-features',   // 2.4M
  'cpp',                          // 1.8M
  'css-language-features',        // 1.4M
  'markdown-math',                // 891K
  'latex',                        // 650K
];

if (!fs.existsSync(EXT_DIR)) {
  console.error('extensions dir not found: ' + EXT_DIR);
  process.exit(1);
}

let removedDirs = 0;
for (const name of REMOVE) {
  const p = path.join(EXT_DIR, name);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log('  rm -rf extensions/' + name);
    removedDirs++;
  }
}
console.log('done: removed ' + removedDirs + ' extension dir(s)');
