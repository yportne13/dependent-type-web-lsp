import { QuickPickItem } from 'vscode';
/** Elaboration engine passed to the CLI server as `TYPORT_LSP_ENGINE`. */
export type Engine = 'reference' | 'twin';
/** Language server backend the extension is running. */
export type Backend = 'wasm' | 'cli';
export declare const ENGINE_KEY = "cli-server.engine";
export declare const BACKEND_KEY = "lsp-mode";
/** `twin` (the L13 performance elaborator) is the only value that opts in. */
export declare function readEngine(backend: Backend): Engine;
export declare function readBackend(): Backend;
export interface ServerActionHost {
    /** Backend the running client was started with. */
    readonly backend: Backend;
    /** Restart the client in place, re-reading settings. */
    restart(): Promise<void>;
    /** Reveal the language server log channel. */
    showLog(): void;
    /** Whether this host can spawn the external CLI server (desktop). */
    readonly canUseCli: boolean;
    /** Whether this host can run the twin engine at all. */
    readonly canUseTwin: boolean;
}
type ActionItem = QuickPickItem & {
    action?: string;
    engine?: Engine;
    backend?: Backend;
};
/** Builds the picker entries; exported for tests / callers that pre-filter. */
export declare function serverActionItems(host: ServerActionHost): ActionItem[];
/** The status-bar item's command handler. */
export declare function showServerActions(host: ServerActionHost): Promise<void>;
export {};
//# sourceMappingURL=serverActions.d.ts.map