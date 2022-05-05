import { IDirectiveManager } from "./directives";
export interface ITreeChangeCallbackParams {
    added: Array<Node>;
    removed: Array<Node>;
}
export declare type TreeChangeCallbackType = (params: ITreeChangeCallbackParams) => void;
export interface IElementScope {
    GetComponentId(): string;
    GetScopeId(): string;
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
    AddUninitCallback(callback: () => void): void;
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
