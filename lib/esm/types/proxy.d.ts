export interface IProxy {
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
}
