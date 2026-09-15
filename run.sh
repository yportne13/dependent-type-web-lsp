git submodule update --init --recursive
node sync_examples.js
cd elaboration-zoo-lsp/vscode_extension
npm install
npm install -g vsce
npm run esbuild
vsce package
unzip "$(ls -t TyportHDL-*.vsix | head -1)" -d ../../sample/TyportHDL-bak
cd ../..
rm -rf sample/TyportHDL
mv sample/TyportHDL-bak/extension sample/TyportHDL
mv sample/TyportHDL-bak/extension.vsixmanifest sample/TyportHDL/.vsixmanifest
rm -rf sample/TyportHDL-bak
curl -o wasm-wasi-core-0.13.3.vsix.gz https://marketplace.visualstudio.com/_apis/public/gallery/publishers/ms-vscode/vsextensions/wasm-wasi-core/0.13.3/vspackage
sleep 2
gunzip wasm-wasi-core-0.13.3.vsix.gz
unzip wasm-wasi-core-0.13.3.vsix -d sample/wasm-wasi-core-bak
rm -rf sample/wasm-wasi-core
mv sample/wasm-wasi-core-bak/extension sample/wasm-wasi-core
mv sample/wasm-wasi-core-bak/extension.vsixmanifest sample/wasm-wasi-core/.vsixmanifest
rm -rf sample/wasm-wasi-core-bak

# The WASI host's stdio pipes are in-memory streams with a fixed 16 KiB
# capacity (Stream.BufferSize); a write larger than that takes the
# backpressure path and waits for the guest to drain before it is even queued.
# Every .typort frame over 16 KiB (adder_proof's didOpen is ~24 KB) hits that
# path, and the demo has been seen to go silent right after such a frame.
# Raise the capacity so ordinary frames never wait; the two known spellings
# differ per host build, so try both and warn if neither matched.
for f in sample/wasm-wasi-core/dist/web/extension.js sample/wasm-wasi-core/dist/desktop/extension.js; do
  [ -f "$f" ] || continue
  if grep -q '_Stream.BufferSize = 16384;' "$f"; then
    sed -i 's/_Stream.BufferSize = 16384;/_Stream.BufferSize = 1048576;/' "$f"
    echo "patched pipe buffer (assignment form) in $f"
  elif grep -q '__publicField(_Stream, "BufferSize", 16384);' "$f"; then
    sed -i 's/__publicField(_Stream, "BufferSize", 16384);/__publicField(_Stream, "BufferSize", 1048576);/' "$f"
    echo "patched pipe buffer (publicField form) in $f"
  else
    echo "WARNING: no known BufferSize declaration found in $f" >&2
  fi
done
curl -o vim.vsix.gz https://marketplace.visualstudio.com/_apis/public/gallery/publishers/vscodevim/vsextensions/vim/1.30.0/vspackage
sleep 2
gunzip vim.vsix.gz
unzip vim.vsix -d sample/vim-bak
mv sample/vim-bak/extension sample/vim
mv sample/vim-bak/extension.vsixmanifest sample/vim/.vsixmanifest
rm -rf sample/vim-bak
