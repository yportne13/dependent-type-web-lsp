"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const extension_1 = require("./extension");
const serverActions_1 = require("./serverActions");
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
// Extra environment for the CLI server process. `undefined` leaves the child
// environment untouched; `typort-hdl.cli-server.engine = "twin"` selects the
// L13 performance elaborator via TYPORT_LSP_ENGINE.
let cliEnv;
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
    // Re-read the engine on every start so a switch from the status bar takes
    // effect on the restart that follows it.
    cliEnv = (0, serverActions_1.readEngine)('cli') === 'twin' ? { TYPORT_LSP_ENGINE: 'twin' } : undefined;
    // `options.env` replaces the child environment, so merge the parent's.
    // Only set when an engine is selected so the default spawn is unchanged.
    // (`process` is read off globalThis because this project's tsconfig only
    // includes the `vscode` types, and this file only runs in the desktop host.)
    const parentEnv = globalThis.process?.env ?? {};
    const serverOptions = cliEnv
        ? { command: cliCommand, args: cliArgs, options: { env: { ...parentEnv, ...cliEnv } } }
        : { command: cliCommand, args: cliArgs };
    const newClient = new node_1.LanguageClient('lspClient', 'LSP Client', serverOptions, cliClientOptions);
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
 * User-initiated restart of the CLI server. Cancels a pending automatic
 * restart and marks the stop as intentional so it is not counted as a crash.
 * Shared by the restart command and the status-bar action picker.
 */
async function restartCliClient() {
    if (restartTimer !== undefined) {
        clearTimeout(restartTimer);
        restartTimer = undefined;
    }
    consecutiveCrashCount = 0;
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
    // The action picker is registered per backend below: the CLI branch wires
    // it to the in-place restart, the WASM branch to `activateWasm`, which
    // registers it itself. Registering it here as well would double-register
    // `typort-hdl.showServerActions`.
    const config = vscode_1.workspace.getConfiguration('typort-hdl');
    const mode = config.get('lsp-mode', 'wasm');
    if (mode === 'cli') {
        cliCommand = config.get('cli-server.path', '') || 'typort';
        cliArgs = ['lsp'];
        logChannel = vscode_1.window.createOutputChannel('TyportHDL Language Server', { log: true });
        logChannel.appendLine(`Starting CLI language server: ${cliCommand} lsp (engine: ${(0, serverActions_1.readEngine)('cli')})`);
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
        context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.restartLanguageServer', () => restartCliClient()));
        context.subscriptions.push(vscode_1.commands.registerCommand('typort-hdl.showServerActions', () => {
            if (!client)
                return;
            return (0, serverActions_1.showServerActions)({
                backend: 'cli',
                canUseCli: true,
                canUseTwin: true,
                restart: () => restartCliClient(),
                showLog: () => logChannel?.show(),
            });
        }));
    }
    else {
        await (0, extension_1.activate)(context, { canUseCli: true, canUseTwin: true });
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