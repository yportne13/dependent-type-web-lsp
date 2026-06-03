"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const extension_1 = require("./extension");
let client;
let statusBarItem;
function updateStatusBar(state) {
    if (!statusBarItem)
        return;
    switch (state) {
        case node_1.State.Starting:
            statusBarItem.text = '$(sync~spin) TyPort';
            statusBarItem.tooltip = 'Starting TyportHDL language server...';
            break;
        case node_1.State.Running:
            statusBarItem.text = '$(check) TyPort';
            statusBarItem.tooltip = 'TyportHDL language server running';
            break;
        case node_1.State.Stopped:
            statusBarItem.text = '$(warning) TyPort';
            statusBarItem.tooltip = 'TyportHDL language server stopped';
            break;
    }
}
async function activate(context) {
    // Create shared status bar
    statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 0);
    statusBarItem.name = 'TyportHDL Language Server';
    statusBarItem.text = '$(sync~spin) TyPort';
    statusBarItem.tooltip = 'Starting TyportHDL language server...';
    statusBarItem.command = 'typort-hdl.showServerActions';
    context.subscriptions.push(statusBarItem);
    statusBarItem.show();
    // Register shared commands
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
            const channel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
            channel.show();
        }
    }));
    const config = vscode_1.workspace.getConfiguration('typort-hdl');
    const mode = config.get('lsp-mode', 'wasm');
    if (mode === 'cli') {
        const command = config.get('cli-server.path', '') || 'typort';
        const channel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
        channel.appendLine(`Starting CLI language server: ${command} lsp`);
        const clientOptions = {
            documentSelector: [{ language: "typort" }],
            outputChannel: channel,
            synchronize: {
                fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
            },
        };
        updateStatusBar(node_1.State.Starting);
        client = new node_1.LanguageClient('lspClient', 'LSP Client', { command, args: ['lsp'] }, clientOptions);
        client.onDidChangeState((e) => updateStatusBar(e.newState));
        try {
            await client.start();
        }
        catch (error) {
            client.error(`Start failed`, error, 'force');
        }
        updateStatusBar(node_1.State.Running);
        context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.restartLanguageServer', async () => {
            if (client) {
                await client.stop();
            }
            updateStatusBar(node_1.State.Starting);
            client = new node_1.LanguageClient('lspClient', 'LSP Client', { command, args: ['lsp'] }, clientOptions);
            client.onDidChangeState((e) => updateStatusBar(e.newState));
            try {
                await client.start();
            }
            catch (error) {
                client.error(`Start failed`, error, 'force');
            }
            updateStatusBar(node_1.State.Running);
            vscode_1.window.showInformationMessage('TyportHDL Language Server restarted.');
        }));
    }
    else {
        await (0, extension_1.activate)(context);
    }
}
exports.activate = activate;
function deactivate() {
    if (client) {
        return client.stop();
    }
    return (0, extension_1.deactivate)();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.desktop.js.map