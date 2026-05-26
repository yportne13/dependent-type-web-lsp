node sync_examples.js
cd elaboration-zoo-lsp/vscode_extension
vsce package
unzip TyportHDL-1.0.0.vsix -d ../../sample/TyportHDL-bak
cd ../..
rm -rf sample/TyportHDL
mv sample/TyportHDL-bak/extension sample/TyportHDL
mv sample/TyportHDL-bak/extension.vsixmanifest sample/TyportHDL/.vsixmanifest
rm -rf sample/TyportHDL-bak
cd sample
npm run sample
