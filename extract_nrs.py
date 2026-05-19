#!/usr/bin/env python3
import re, sys
with open('F:/projects/Rust/typort-lsp/sample/myExt/extension.js', 'r', encoding='utf-8') as f:
    content = f.read()
marker = '(e.nrsFile ='
start = content.index(marker)
tick_start = content.index('`', start) + 1
tick_end = content.index('`\n          )', tick_start)
nrs = content[tick_start:tick_end]
out = 'F:/projects/Rust/typort-lsp/check_example.typort'
with open(out, 'w', encoding='utf-8') as f:
    f.write(nrs)
print(f'Extracted {len(nrs)} chars to {out}')
