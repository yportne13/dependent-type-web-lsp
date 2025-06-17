"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const wasm_wasi_1 = require("@vscode/wasm-wasi");
const wasm_wasi_lsp_1 = require("@vscode/wasm-wasi-lsp");
let client;
async function activate(context) {
    const wasm = await wasm_wasi_1.Wasm.load();
    const channel = vscode_1.window.createOutputChannel('LSP WASM Server');
    const serverOptions = async () => {
        const options = {
            stdio: (0, wasm_wasi_lsp_1.createStdioOptions)(),
            mountPoints: [
                { kind: 'workspaceFolder' },
            ]
        };
        const filename = vscode_1.Uri.joinPath(context.extensionUri, 'client', 'server.wasm');
        const bits = await vscode_1.workspace.fs.readFile(filename);
        const module = await WebAssembly.compile(bits);
        const process = await wasm.createProcess('lsp-server', module, { initial: 160, maximum: 160, shared: true }, options);
        const decoder = new TextDecoder('utf-8');
        process.stderr.onData((data) => {
            channel.append(decoder.decode(data));
        });
        return (0, wasm_wasi_lsp_1.startServer)(process);
    };
    const clientOptions = {
        documentSelector: [{ language: "typort" }],
        outputChannel: channel,
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
        uriConverters: (0, wasm_wasi_lsp_1.createUriConverters)(),
    };
    client = new node_1.LanguageClient('lspClient', 'LSP Client', serverOptions, clientOptions);
    try {
        await client.start();
    }
    catch (error) {
        client.error(`Start failed`, error, 'force');
    }
    const CountFilesRequest = new node_1.RequestType('wasm-language-server/countFiles');
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-samples.wasm-language-server.countFiles', async () => {
        // We assume we do have a folder.
        const folder = vscode_1.workspace.workspaceFolders[0].uri;
        // We need to convert the folder URI to a URI that maps to the mounted WASI file system. This is something
        // @vscode/wasm-wasi-lsp does for us.
        const result = await client.sendRequest(CountFilesRequest, { folder: client.code2ProtocolConverter.asUri(folder) });
        vscode_1.window.showInformationMessage(`The workspace contains ${result} files.`);
    }));
}
exports.activate = activate;
function deactivate() {
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map