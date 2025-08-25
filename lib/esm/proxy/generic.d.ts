import { IProxy } from "../types/proxy";
export declare class GenericProxy implements IProxy {
    protected componentId_: string;
    protected target_: any;
    private name_;
    private parentPath_;
    protected native_: any;
    protected children_: Record<string, IProxy>;
    constructor(componentId_: string, target_: any, name_: string, parent?: IProxy, scopeId?: string | null);
    IsRoot(): boolean;
    GetComponentId(): string;
    GetTarget(): any;
    GetNative(): any;
    GetName(): string;
    GetPath(): string;
    GetParentPath(): string;
    AddChild(child: IProxy): void;
    RemoveChild(child: IProxy | string): void;
    FindChild(name: string): IProxy | null;
    Destroy(): void;
}
