import { ExtensionContext } from 'vscode';
export interface ActivateOptions {
    /**
     * Desktop hosts can spawn the external CLI server, so the action picker
     * offers switching the backend. The web host cannot.
     */
    canUseCli?: boolean;
    /**
     * Whether the twin engine may be selected. Both desktop backends support
     * it (the WASM module reads `TYPORT_LSP_ENGINE`); the web host is kept on
     * the reference engine.
     */
    canUseTwin?: boolean;
}
export declare function activate(context: ExtensionContext, options?: ActivateOptions): Promise<void>;
export declare function deactivate(): Promise<void> | void;
//# sourceMappingURL=extension.d.ts.map