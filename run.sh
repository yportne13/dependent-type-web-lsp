git submodule update --init --recursive
cd elaboration-zoo-lsp/vscode_extension
npm install
npm install -g vsce
npm run esbuild
vsce package
unzip TyportHDL-1.0.0.vsix -d ../../sample/TyportHDL-bak
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
curl -o vim.vsix.gz https://marketplace.visualstudio.com/_apis/public/gallery/publishers/vscodevim/vsextensions/vim/1.30.0/vspackage
sleep 2
gunzip vim.vsix.gz
unzip vim.vsix -d sample/vim-bak
mv sample/vim-bak/extension sample/vim
mv sample/vim-bak/extension.vsixmanifest sample/vim/.vsixmanifest
rm -rf sample/vim-bak
