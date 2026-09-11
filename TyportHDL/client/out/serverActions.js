"use strict";
/* --------------------------------------------------------------------------------------------
 * Status-bar action picker for the TyportHDL language server.
 *
 * Shared by the WASM entry (`extension.ts`, used on web and on the desktop
 * WASM backend) and the desktop entry (`extension.desktop.ts`, CLI backend).
 * The picker exposes the two elaboration backends and the two engines; the
 * engine only takes effect on the CLI backend, so selecting `twin` from a
 * WASM host first offers to move to the CLI backend.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.showServerActions = exports.serverActionItems = exports.readBackend = exports.readEngine = exports.BACKEND_KEY = exports.ENGINE_KEY = void 0;
const vscode_1 = require("vscode");
const SECTION = 'typort-hdl';
exports.ENGINE_KEY = 'cli-server.engine';
exports.BACKEND_KEY = 'lsp-mode';
/** `twin` (the L13 performance elaborator) is the only value that opts in. */
function readEngine() {
    const value = vscode_1.workspace.getConfiguration(SECTION).get(exports.ENGINE_KEY, 'reference');
    return value.toLowerCase() === 'twin' ? 'twin' : 'reference';
}
exports.readEngine = readEngine;
function readBackend() {
    const value = vscode_1.workspace.getConfiguration(SECTION).get(exports.BACKEND_KEY, 'wasm');
    return value.toLowerCase() === 'cli' ? 'cli' : 'wasm';
}
exports.readBackend = readBackend;
/**
 * Persist a setting where it is already overridden: a workspace-level value
 * would otherwise shadow a user-level write and the switch would look like a
 * no-op.
 */
async function writeSetting(key, value) {
    const config = vscode_1.workspace.getConfiguration(SECTION);
    const target = config.inspect(key)?.workspaceValue !== undefined
        ? vscode_1.ConfigurationTarget.Workspace
        : vscode_1.ConfigurationTarget.Global;
    await config.update(key, value, target);
}
function radio(selected, label) {
    return `${selected ? '$(circle-filled)' : '$(circle-outline)'} ${label}`;
}
/** Builds the picker entries; exported for tests / callers that pre-filter. */
function serverActionItems(host) {
    const items = [];
    if (host.canUseTwin) {
        const engine = readEngine();
        items.push({ label: 'Elaboration engine', kind: vscode_1.QuickPickItemKind.Separator }, {
            label: radio(engine === 'reference', 'Reference'),
            description: 'baseline; lower memory',
            engine: 'reference',
        }, {
            label: radio(engine === 'twin', 'Twin (performance)'),
            description: host.backend === 'cli'
                ? '~3.8x faster per edit, ~2x memory'
                : '~3.8x faster per edit; raises the WASM memory ceiling',
            engine: 'twin',
        });
    }
    if (host.canUseCli) {
        items.push({ label: 'Language server backend', kind: vscode_1.QuickPickItemKind.Separator }, {
            label: radio(host.backend === 'wasm', 'WASM (built-in)'),
            description: 'bundled server.wasm; no external binary',
            backend: 'wasm',
        }, {
            label: radio(host.backend === 'cli', 'CLI (external typort)'),
            description: 'spawns `typort lsp`',
            backend: 'cli',
        });
    }
    items.push({ label: '', kind: vscode_1.QuickPickItemKind.Separator }, { label: '$(debug-restart) Restart Language Server', action: 'restart' }, { label: '$(output) Show Log', action: 'log' });
    return items;
}
exports.serverActionItems = serverActionItems;
async function applyEngine(engine, host) {
    if (engine === readEngine()) {
        return;
    }
    if (!host.canUseTwin) {
        vscode_1.window.showInformationMessage('The twin engine is not available in this host.');
        return;
    }
    // Both backends read the setting at spawn, so a restart applies it.
    await writeSetting(exports.ENGINE_KEY, engine);
    await host.restart();
}
async function applyBackend(backend, host) {
    if (backend === host.backend) {
        return;
    }
    if (backend === 'cli' && !host.canUseCli) {
        vscode_1.window.showInformationMessage('The CLI backend is not available in this host.');
        return;
    }
    await writeSetting(exports.BACKEND_KEY, backend);
    // The backend is chosen once at activation, so re-activate the extension.
    await vscode_1.commands.executeCommand('workbench.action.reloadWindow');
}
/** The status-bar item's command handler. */
async function showServerActions(host) {
    const pick = await vscode_1.window.showQuickPick(serverActionItems(host), {
        placeHolder: 'Language Server Actions',
    });
    if (!pick) {
        return;
    }
    if (pick.engine) {
        await applyEngine(pick.engine, host);
    }
    else if (pick.backend) {
        await applyBackend(pick.backend, host);
    }
    else if (pick.action === 'restart') {
        await host.restart();
    }
    else if (pick.action === 'log') {
        host.showLog();
    }
}
exports.showServerActions = showServerActions;
//# sourceMappingURL=serverActions.js.map