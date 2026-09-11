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
const serverActions_1 = require("./serverActions");
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
// The WASM module's linear memory, in 64 KiB pages. Must match the linker's
// `--initial-memory` / `--max-memory` in the extension's `npm run build`
// (vscode_extension/package.json): the wasm32-wasip1-threads module imports a
// shared memory with those exact bounds, so a mismatch fails instantiation.
// 2 GiB max leaves headroom for the twin engine's resident state (~730 MB
// peak measured natively, vs ~200 MB for the reference engine).
const WASM_INITIAL_PAGES = 640; // 41,943,040 bytes
const WASM_MAX_PAGES = 32768; // 2,147,483,648 bytes
async function startLanguageServer(context, wasm, canUseTwin) {
    if (!channel) {
        channel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
    }
    const serverOptions = async () => {
        const engine = canUseTwin ? (0, serverActions_1.readEngine)() : 'reference';
        const options = {
            stdio: (0, wasm_wasi_lsp_1.createStdioOptions)(),
            mountPoints: [
                { kind: 'workspaceFolder' },
            ],
            // The WASM guest reads this through `Engine::from_env`; without it
            // the server always elaborates with the reference engine.
            env: engine === 'twin' ? { TYPORT_LSP_ENGINE: 'twin' } : undefined,
        };
        const filename = vscode_1.Uri.joinPath(context.extensionUri, 'client', 'server.wasm');
        const bits = await vscode_1.workspace.fs.readFile(filename);
        const module = await WebAssembly.compile(bits);
        const process = await wasm.createProcess('lsp-server', module, { initial: WASM_INITIAL_PAGES, maximum: WASM_MAX_PAGES, shared: true }, options);
        const decoder = new TextDecoder('utf-8');
        process.stderr.onData((data) => {
            channel.append(decoder.decode(data));
        });
        return (0, wasm_wasi_lsp_1.startServer)(process);
    };
    const clientOptions = {
        documentSelector: [{ language: "typort" }],
        outputChannel: channel,
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
/** Stop the running client and start a fresh one (status bar + command). */
async function restartLanguageServer(context, wasm, canUseTwin) {
    if (client) {
        await client.stop();
    }
    updateStatusBar(vscode_languageclient_1.State.Starting);
    client = await startLanguageServer(context, wasm, canUseTwin);
    client.onDidChangeState((e) => {
        updateStatusBar(e.newState);
    });
    updateStatusBar(vscode_languageclient_1.State.Running);
}
async function activate(context, options = {}) {
    const wasm = await v1_1.Wasm.load();
    const canUseTwin = options.canUseTwin ?? false;
    // Status bar
    statusBarItem = createStatusBarItem();
    context.subscriptions.push(statusBarItem);
    statusBarItem.show();
    updateStatusBar(vscode_languageclient_1.State.Starting);
    client = await startLanguageServer(context, wasm, canUseTwin);
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
        await restartLanguageServer(context, wasm, canUseTwin);
        vscode_1.window.showInformationMessage('TyportHDL Language Server restarted.');
    }));
    // ── Status bar actions ────────────────────────────────────────────────
    context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.showServerActions', () => {
        if (!client)
            return;
        return (0, serverActions_1.showServerActions)({
            backend: 'wasm',
            canUseCli: options.canUseCli ?? false,
            canUseTwin,
            restart: () => restartLanguageServer(context, wasm, canUseTwin),
            showLog: () => channel.show(),
        });
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