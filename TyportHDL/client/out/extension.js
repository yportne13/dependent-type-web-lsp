"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const v1_1 = require("@vscode/wasm-wasi/v1");
const wasm_wasi_lsp_1 = require("@vscode/wasm-wasi-lsp");
let client;
let channel;
async function startLanguageServer(context, wasm) {
    if (!channel) {
        channel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
    }
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
        const process = await wasm.createProcess('lsp-server', module, { initial: 640, maximum: 16000, shared: true }, options);
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
            fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
        },
        uriConverters: (0, wasm_wasi_lsp_1.createUriConverters)(),
    };
    const newClient = new vscode_languageclient_1.LanguageClient('lspClient', 'LSP Client', serverOptions, clientOptions);
    try {
        await newClient.start();
    }
    catch (error) {
        newClient.error(`Start failed`, error, 'force');
    }
    return newClient;
}
async function activate(context) {
    const wasm = await v1_1.Wasm.load();
    client = await startLanguageServer(context, wasm);
    // Register a text content provider for builtin:// URIs (e.g., prelude files).
    // When the user navigates to a builtin:// URI via go-to-definition, VS Code
    // calls this provider to get the file content instead of reading from disk.
    const BuiltinContentRequest = new vscode_languageclient_1.RequestType('typort-hdl/builtinContent');
    context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('builtin', {
        async provideTextDocumentContent(uri) {
            if (!client) {
                return undefined;
            }
            try {
                const content = await client.sendRequest(BuiltinContentRequest, { uri: uri.toString() });
                return content ?? undefined;
            }
            catch {
                return undefined;
            }
        }
    }));
    const CountFilesRequest = new vscode_languageclient_1.RequestType('wasm-language-server/countFiles');
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-samples.wasm-language-server.countFiles', async () => {
        const folder = vscode_1.workspace.workspaceFolders[0].uri;
        const result = await client.sendRequest(CountFilesRequest, { folder: client.code2ProtocolConverter.asUri(folder) });
        vscode_1.window.showInformationMessage(`The workspace contains ${result} files.`);
    }));
    const ExpandMacroRequest = new vscode_languageclient_1.RequestType('typort-hdl/expandMacro');
    context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.expandMacro', async () => {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor || !client) {
            return;
        }
        const uri = editor.document.uri.toString();
        const position = editor.selection.active;
        try {
            const result = await client.sendRequest(ExpandMacroRequest, { uri, position });
            if (result) {
                const doc = await vscode_1.workspace.openTextDocument({
                    content: result.expanded_text,
                    language: 'typort',
                });
                await vscode_1.window.showTextDocument(doc, { preview: true });
            }
            else {
                vscode_1.window.showInformationMessage('No macro expansion found at cursor position.');
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage(`Expand macro failed: ${error}`);
        }
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.restartLanguageServer', async () => {
        if (client) {
            await client.stop();
        }
        client = await startLanguageServer(context, wasm);
        vscode_1.window.showInformationMessage('TyportHDL Language Server restarted.');
    }));
}
exports.activate = activate;
function deactivate() {
    if (client) {
        return client.stop();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map