import { IDirectiveManager } from "./directives";

export interface IElementScope{
    GetComponentId(): string;
    GetScopeId(): string;
    GetId(): string;

    SetKey(key: string): void;
    GetKey(): string;

    GetElement(): HTMLElement;
    IsRoot(): boolean;

    SetLocal(key: string, value: any): void;
    DeleteLocal(key: string): void;
    
    GetLocal(key: string): any;
    GetLocals(): Record<string, any>;

    SetData(key: string, value: any): void;
    GetData(key: string): any;
    
    AddPostProcessCallback(callback: () => void): void;
    ExecutePostProcessCallbacks(): void;

    AddUninitCallback(callback: () => void): void;

    AddAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>): void;
    RemoveAttributeChangeCallback(callback: (name?: string) => void, whitelist?: string | Array<string>): void;
    ExecuteAttributeChangeCallbacks(name: string): void;

    Destroy(markOnly?: boolean): void;
    IsMarked(): boolean;
    IsDestroyed(): boolean;

    GetDirectiveManager(): IDirectiveManager;
}
