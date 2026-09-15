"use strict";
/* --------------------------------------------------------------------------------------------
 * Status-bar action picker for the TyportHDL language server.
 *
 * Shared by the WASM entry (`extension.ts`, used on web and on the desktop
 * WASM backend) and the desktop entry (`extension.desktop.ts`, CLI backend).
 * The picker switches the language server backend (WASM vs CLI); the
 * elaboration engine is no longer a user-facing choice — the desktop backends
 * run the L13 performance twin, while the WASM backend defaults to the
 * reference elaborator (see `UNSET_ENGINE`).  `readEngine` honors an explicit
 * `typort-hdl.cli-server.engine` setting as the escape hatch in both
 * directions, on the web host too.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.showServerActions = exports.serverActionItems = exports.readBackend = exports.readEngine = exports.BACKEND_KEY = exports.ENGINE_KEY = void 0;
const vscode_1 = require("vscode");
const SECTION = 'typort-hdl';
exports.ENGINE_KEY = 'cli-server.engine';
exports.BACKEND_KEY = 'lsp-mode';
/** Engine used when the setting has not been set explicitly. */
const UNSET_ENGINE = {
    // The CLI backend runs the L13 twin.  The web (wasm) backend defaults to
    // the reference elaborator: the twin's resident state needs ~1.2 GB of the
    // wasm module's hard 2 GiB linear-memory ceiling (the SharedArrayBuffer
    // maximum) for one proof-sized file, and a guest that cannot grow dies as a
    // `RuntimeError: unreachable` trap that the client never sees — the status
    // bar keeps claiming "running" while the server is gone.  The reference
    // path needs ~0.33 GB for the same file.  Opt back in per machine with
    // `typort-hdl.cli-server.engine = "twin"`.
    wasm: 'reference',
    cli: 'twin',
};
/**
 * The user-set value, ignoring the schema default. `get()` alone cannot be
 * used here: the schema default (`twin`, see package.json) would be
 * indistinguishable from an explicit choice.
 */
function explicitEngine() {
    const inspect = vscode_1.workspace.getConfiguration(SECTION).inspect(exports.ENGINE_KEY);
    return inspect?.workspaceFolderValue ?? inspect?.workspaceValue ?? inspect?.globalValue;
}
/** `twin` (the L13 performance elaborator) is the only value that opts in. */
function readEngine(backend) {
    const explicit = explicitEngine();
    if (explicit !== undefined) {
        return explicit.toLowerCase() === 'twin' ? 'twin' : 'reference';
    }
    return UNSET_ENGINE[backend];
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
    items.push({ label: 'Elaboration engine', kind: vscode_1.QuickPickItemKind.Separator }, {
        label: radio(host.engine === 'reference', 'Reference'),
        description: 'baseline elaborator; ~0.3 GB in the web host',
        engine: 'reference',
    }, {
        label: radio(host.engine === 'twin', 'Twin (performance)'),
        description: 'faster per edit, ~2x memory (~1.2 GB in the web host)',
        engine: 'twin',
    });
    if (host.liveness) {
        items.push({ label: 'Status', kind: vscode_1.QuickPickItemKind.Separator }, { label: `$(pulse) Language server: ${host.liveness()}` });
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
/**
 * Switch the elaboration engine.  Both hosts re-read `typort-hdl.cli-server.engine`
 * when they (re)start, so this takes effect in place — no window reload.
 */
async function applyEngine(engine, host) {
    if (engine === host.engine) {
        return;
    }
    await writeSetting(exports.ENGINE_KEY, engine);
    await host.restart();
    vscode_1.window.showInformationMessage(`TyportHDL: elaboration engine = ${engine}.`);
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