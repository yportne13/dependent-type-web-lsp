
npm install
vsce package
unzip wasm-language-server-1.0.0.vsix -d sample/wasm-language-server-bak
rm -rf sample/wasm-language-server
mv sample/wasm-language-server-bak/extension sample/wasm-language-server
mv sample/wasm-language-server-bak/extension.vsixmanifest sample/wasm-language-server/.vsixmanifest
rm -rf sample/wasm-language-server-bak
# download https://marketplace.visualstudio.com/_apis/public/gallery/publishers/my-vscode/vsextensions/wasm-wasi-core/1.0.2/vspackage
unzip ms-vscode.wasm-wasi-core-1.0.2.vsix -d sample/wasm-wasi-core-bak
mv sample/wasm-wasi-core-bak/extension sample/wasm-wasi-core
mv sample/wasm-wasi-core-bak/extension.vsixmanifest sample/wasm-wasi-core/.vsixmanifest
rm -rf sample/wasm-wasi-core-bak
# curl -o vim.vsix https://marketplace.visualstudio.com/_apis/public/gallery/publishers/vscodevim/vsextensions/vim/1.30.0/vspackage
# unzip vim.vsix -d sample/vim-bak
# mv sample/vim-bak/extension sample/vim
# mv sample/vim-bak/extension.vsixmanifest sample/vim/.vsixmanifest
# rm -rf sample/vim-bak

