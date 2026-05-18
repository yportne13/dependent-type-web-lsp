# Vscode Web Language Server Example

a mix of [vscode-web](https://github.com/Felx-B/vscode-web) and [tower-lsp-boilerplate](https://github.com/IWANABETHATGUY/tower-lsp-boilerplate) and [vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples).

a pure web language server.

demo at: https://dependent-type-web-lsp.pages.dev/

## Adding / updating Typort examples

Examples live in the **submodule** at `elaboration-zoo-lsp/examples/*.typort`.
To sync them into the web demo:

```bash
git submodule update --remote       # pull latest examples
node sync_examples.js               # embed into extension.js
# then commit: git add -A && git commit -m "..."
```
