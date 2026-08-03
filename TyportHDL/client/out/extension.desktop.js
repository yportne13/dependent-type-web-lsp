"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const extension_1 = require("./extension");
// Maximum number of consecutive unexpected server exits before we stop
// retrying automatically and ask the user to restart the server manually.
const MAX_CONSECUTIVE_CRASHES = 5;
// Delay before restarting a crashed server to avoid a crash-restart storm.
const AUTO_RESTART_DELAY_MS = 1000;
let client;
let statusBarItem;
let logChannel;
// CLI server settings, resolved once in activate().
let cliCommand = 'typort';
let cliArgs = ['lsp'];
let cliClientOptions;
// Number of consecutive unexpected server exits. Reset to 0 whenever the
// server successfully reaches State.Running (automatic or manual restart).
let consecutiveCrashCount = 0;
// True while a stop is user-initiated (manual restart command / extension
// deactivation). Such stops must not be treated as crashes.
let userStopped = false;
// Pending auto-restart timer after an unexpected server exit.
let restartTimer;
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
        case node_1.State.StartFailed:
            statusBarItem.text = '$(error) TyPort';
            statusBarItem.tooltip = 'TyportHDL language server failed to start';
            break;
    }
}
/**
 * Creates a fresh LanguageClient for the CLI server and starts it.
 * Shared by the initial activation, the manual restart command and the
 * automatic restart after a server crash.
 */
async function startClient() {
    if (!cliClientOptions)
        return;
    updateStatusBar(node_1.State.Starting);
    const newClient = new node_1.LanguageClient('lspClient', 'LSP Client', { command: cliCommand, args: cliArgs }, cliClientOptions);
    newClient.onDidChangeState(handleStateChange);
    client = newClient;
    try {
        await newClient.start();
    }
    catch (error) {
        newClient.error(`Start failed`, error, 'force');
    }
    if (newClient.state === node_1.State.Running) {
        updateStatusBar(node_1.State.Running);
    }
}
/**
 * Reacts to language client state changes: updates the status bar, resets the
 * consecutive crash counter on a successful start and, on an unexpected stop
 * (server crash), schedules an automatic restart (up to 5 consecutive times).
 */
function handleStateChange(e) {
    updateStatusBar(e.newState);
    if (e.newState === node_1.State.Running) {
        // A server that (re)started successfully breaks the chain of
        // consecutive crashes.
        consecutiveCrashCount = 0;
        return;
    }
    if (e.newState !== node_1.State.Stopped) {
        return;
    }
    // From here on the server stopped. Distinguish an unexpected exit (crash)
    // from a stop we triggered ourselves.
    if (userStopped) {
        return;
    }
    if (restartTimer !== undefined) {
        return; // A restart is already scheduled.
    }
    consecutiveCrashCount += 1;
    if (consecutiveCrashCount >= MAX_CONSECUTIVE_CRASHES) {
        logChannel?.appendLine(`Server exited unexpectedly ${MAX_CONSECUTIVE_CRASHES} times in a row. Stopping automatic restarts; please restart the language server manually.`);
        void vscode_1.window.showErrorMessage('TyportHDL language server crashed 5 times in a row. Please restart it manually.', 'Restart').then((action) => {
            if (action === 'Restart') {
                void vscode_1.commands.executeCommand('typort-hdl.restartLanguageServer');
            }
        });
        return;
    }
    logChannel?.appendLine(`Server exited unexpectedly, restarting (attempt ${consecutiveCrashCount}/${MAX_CONSECUTIVE_CRASHES})...`);
    updateStatusBar(node_1.State.Starting);
    restartTimer = setTimeout(() => {
        restartTimer = undefined;
        void startClient();
    }, AUTO_RESTART_DELAY_MS);
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
            logChannel?.show();
        }
    }));
    const config = vscode_1.workspace.getConfiguration('typort-hdl');
    const mode = config.get('lsp-mode', 'wasm');
    if (mode === 'cli') {
        cliCommand = config.get('cli-server.path', '') || 'typort';
        cliArgs = ['lsp'];
        logChannel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
        logChannel.appendLine(`Starting CLI language server: ${cliCommand} lsp`);
        cliClientOptions = {
            documentSelector: [{ language: "typort" }],
            outputChannel: logChannel,
            errorHandler: {
                error: (_error, _message, count) => {
                    // Match the library default: tolerate up to 3 consecutive
                    // connection errors before shutting the server down.
                    if (count !== undefined && count <= 3) {
                        return { action: node_1.ErrorAction.Continue };
                    }
                    return { action: node_1.ErrorAction.Shutdown };
                },
                closed: () => {
                    // Never let the library restart the server by itself: the
                    // built-in restart has no consecutive-crash limit and no
                    // delay, which would conflict with the restart logic here.
                    // All restarts are managed via handleStateChange.
                    return { action: node_1.CloseAction.DoNotRestart, message: 'Language server process exited', handled: true };
                },
            },
        };
        await startClient();
        context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.restartLanguageServer', async () => {
            // The user takes control: cancel any pending automatic restart and
            // break the chain of consecutive crashes.
            if (restartTimer !== undefined) {
                clearTimeout(restartTimer);
                restartTimer = undefined;
            }
            consecutiveCrashCount = 0;
            // Mark the stop as user-initiated so that it is not counted as a
            // crash by handleStateChange.
            userStopped = true;
            try {
                if (client) {
                    try {
                        await client.stop();
                    }
                    catch (error) {
                        client.error(`Stopping server failed`, error, 'force');
                    }
                }
            }
            finally {
                userStopped = false;
            }
            await startClient();
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
        // The extension is going down: cancel a pending automatic restart and
        // mark the final stop as user-initiated so no restart is attempted.
        if (restartTimer !== undefined) {
            clearTimeout(restartTimer);
            restartTimer = undefined;
        }
        userStopped = true;
        return client.stop();
    }
    return (0, extension_1.deactivate)();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.desktop.js.map