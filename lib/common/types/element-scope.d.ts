import { IDirectiveManager } from "./directive";
export interface ITreeChangeCallbackParams {
    added: Array<Node>;
    removed: Array<Node>;
}
export interface IChangesMonitorParams {
    target: string;
    object: () => any;
}
export type ChangesMonitorType = (params: IChangesMonitorParams) => void;
export type TreeChangeCallbackType = (params: ITreeChangeCallbackParams) => void;
export interface IElementScope {
    IsInitialized(): boolean;
    GetComponentId(): string;
    GetId(): string;
    SetKey(key: string): void;
    GetKey(): string;
    GetElement(): HTMLElement;
    IsRoot(): boolean;
    SetLocal(key: string, value: any): void;
    DeleteLocal(key: string): void;
    HasLocal(key: string): boolean;
    GetLocal(key: string): any;
    GetLocals(): Record<string, any>;
    SetData(key: string, value: any): void;
    GetData(key: string): any;
    AddPostProcessCallback(callback: () => void): void;
    ExecutePostProcessCallbacks(): void;
    AddPostAttributesProcessCallback(callback: () => void): void;
    ExecutePostAttributesProcessCallbacks(): void;
    AddUninitCallback(callback: () => void): void;
    RemoveUninitCallback(callback: () => void): void;
    AddMarkedCallback(callback: () => void): void;
    RemoveMarkedCallback(callback: () => void): void;
    AddTreeChangeCallback(callback: TreeChangeCallbackType): void;
    RemoveTreeChangeCallback(callback: TreeChangeCallbackType): void;
    ExecuteTreeChangeCallbacks(added: Array<Node>, removed: Array<Node>): void;
    AddAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>): void;
    RemoveAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>): void;
    ExecuteAttributeChangeCallbacks(name: string): void;
    Destroy(markOnly?: boolean): void;
    IsMarked(): boolean;
    IsDestroyed(): boolean;
    GetDirectiveManager(): IDirectiveManager;
}
