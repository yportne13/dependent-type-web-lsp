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
// ── Status Bar ──────────────────────────────────────────────────────────────
let statusBarItem;
function createStatusBarItem() {
    const item = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 0);
    item.name = 'TyportHDL Language Server';
    item.text = '$(sync~spin) TyPort';
    item.tooltip = 'Starting TyportHDL Language Server...';
    item.command = 'typort-hdl.showServerActions';
    return item;
}
function updateStatusBar(state) {
    switch (state) {
        case vscode_languageclient_1.State.Starting:
            statusBarItem.text = '$(sync~spin) TyPort';
            statusBarItem.tooltip = 'Starting TyportHDL language server...';
            break;
        case vscode_languageclient_1.State.Running:
            statusBarItem.text = '$(check) TyPort';
            statusBarItem.tooltip = 'TyportHDL language server running';
            break;
        case vscode_languageclient_1.State.Stopped:
            statusBarItem.text = '$(warning) TyPort';
            statusBarItem.tooltip = 'TyportHDL language server stopped';
            break;
    }
}
// ── Server Start ────────────────────────────────────────────────────────────
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
// ── Activation ──────────────────────────────────────────────────────────────
async function activate(context) {
    const wasm = await v1_1.Wasm.load();
    // Status bar
    statusBarItem = createStatusBarItem();
    context.subscriptions.push(statusBarItem);
    statusBarItem.show();
    updateStatusBar(vscode_languageclient_1.State.Starting);
    client = await startLanguageServer(context, wasm);
    // Track language client state changes → update status bar
    client.onDidChangeState((e) => {
        updateStatusBar(e.newState);
    });
    // After client is started, update to running state
    updateStatusBar(vscode_languageclient_1.State.Running);
    // ── Builtin content provider ──────────────────────────────────────────
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
        const uri = client.code2ProtocolConverter.asUri(editor.document.uri);
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
    // ── Restart server ────────────────────────────────────────────────────
    context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.restartLanguageServer', async () => {
        if (client) {
            await client.stop();
        }
        updateStatusBar(vscode_languageclient_1.State.Starting);
        client = await startLanguageServer(context, wasm);
        client.onDidChangeState((e) => {
            updateStatusBar(e.newState);
        });
        updateStatusBar(vscode_languageclient_1.State.Running);
        vscode_1.window.showInformationMessage('TyportHDL Language Server restarted.');
    }));
    // ── Status bar actions ────────────────────────────────────────────────
    context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.showServerActions', async () => {
        if (!client)
            return;
        const pick = await vscode_1.window.showQuickPick([
            { label: '$(debug-restart) Restart Language Server', description: 'Restart the TyportHDL language server' },
            { label: '$(output) Show Log', description: 'Open the language server output channel' },
        ], { placeHolder: 'Language Server Actions' });
        if (!pick)
            return;
        if (pick.label.includes('Restart')) {
            vscode_1.commands.executeCommand('typort-hdl.restartLanguageServer');
        }
        else if (pick.label.includes('Log')) {
            channel.show();
        }
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