import { IDirectiveManager } from "../types/directive";
import { IElementScope, TreeChangeCallbackType } from "../types/element-scope";
import { ChangesMonitor } from "./changes-monitor";
export declare class ElementScope extends ChangesMonitor implements IElementScope {
    private componentId_;
    private id_;
    private element_;
    private isRoot_;
    private isInitialized_;
    private key_;
    private locals_;
    private data_;
    private queuedAttributeChanges_;
    private managers_;
    private callbacks_;
    private state_;
    constructor(componentId_: string, id_: string, element_: HTMLElement, isRoot_: boolean);
    SetInitialized(): void;
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
    private DestroyChildren_;
}
