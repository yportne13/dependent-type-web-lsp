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
// Tier 1: full language services never activated by a .typort-only demo.
const REMOVE = [
  'typescript-language-features', // 16M — tsserver language service
  'html-language-features',       // 7.1M
  'markdown-language-features',   // 2.4M
  'cpp',                          // 1.8M
  'css-language-features',        // 1.4M
  'markdown-math',                // 891K
  'latex',                        // 650K
  // Tier 2: plain syntax-highlighting extensions for languages the demo
  // never opens. Safe: vscode tolerates absent builtins (dir scan at startup).
  'javascript',
  'typescript-basics',
  'objective-c',
  'ipynb',
  'php',
  'swift',
  'csharp',
  'python',
  'less',
  'scss',
  'perl',
  'go',
  'shellscript',
  'ruby',
  'julia',
  'r',
  'razor',
  'java',
  'fsharp',
  'coffeescript',
  'powershell',
  'groovy',
  'sql',
  'yaml',
  'rust',
  'bat',
  'xml',
  'pug',
  'handlebars',
  'lua',
  'vb',
  'restructuredtext',
  'make',
  'shaderlab',
  'hlsl',
  'clojure',
  'ini',
  'dart',
  'docker',
  'log',
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

// --- Also drop the language-detection model (1.5M). ---
// Only used to auto-detect a file's language when it has no extension; the
// demo opens .typort files only, so it never fires. Verified: workbench
// tolerates its absence (no console errors).
const LD = path.join(__dirname, 'depend', 'vscode-web', 'dist', 'depend', '@vscode', 'vscode-languagedetection');
if (fs.existsSync(LD)) {
  fs.rmSync(LD, { recursive: true, force: true });
  console.log('  rm -rf depend/@vscode/vscode-languagedetection');
  removedDirs++;
}

console.log('done: removed ' + removedDirs + ' item(s)');
