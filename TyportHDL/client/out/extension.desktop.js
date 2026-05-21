"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
require("vscode-languageclient/node");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const extension_1 = require("./extension");
let client;
async function activate(context) {
    const config = vscode_1.workspace.getConfiguration('typort-hdl');
    const mode = config.get('lsp-mode', 'wasm');
    if (mode === 'cli') {
        const command = config.get('cli-server.path', '') || 'typort';
        const channel = vscode_1.window.createOutputChannel('TyportHDL Language Server');
        channel.appendLine(`Starting CLI language server: ${command} lsp`);
        const clientOptions = {
            documentSelector: [{ language: "typort" }],
            outputChannel: channel,
            synchronize: {
                fileEvents: vscode_1.workspace.createFileSystemWatcher("**/.clientrc"),
            },
        };
        client = new node_1.LanguageClient('lspClient', 'LSP Client', { command, args: ['lsp'] }, clientOptions);
        try {
            await client.start();
        }
        catch (error) {
            client.error(`Start failed`, error, 'force');
        }
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