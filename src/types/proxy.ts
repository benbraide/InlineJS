export interface IProxy{
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

export interface IProxyAccessHandler{
    Get?(key: string | number, target: object): any;
    Set?(key: string | number, value: any, target: object): any;
    Delete?(key: string | number, target: object): any;
    Has?(key: string | number, target: object): boolean;
}
