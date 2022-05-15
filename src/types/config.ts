export type ReactiveStateType = 'default' | 'optimized' | 'unoptimized' | 'disabled';
export type DirectiveNameBuilderType = (name: string, addDataPrefix?: boolean) => string;

export interface IConfigOptions{
    appName?: string;
    reactiveState?: ReactiveStateType;
    directivePrefix?: string;
    directiveRegex?: RegExp;
    directiveNameBuilder?: DirectiveNameBuilderType;
}

export interface IConfig{
    GetAppName(): string;
    
    GetDirectiveRegex(): RegExp;
    GetDirectiveName(name: string, addDataPrefix?: boolean): string;

    AddKeyEventMap(key: string, target: string): void;
    RemoveKeyEventMap(key: string): void;
    MapKeyEvent(key: string): string | Array<string>;

    AddBooleanAttribute(name: string): void;
    RemoveBooleanAttribute(name: string): void;
    IsBooleanAttribute(name: string): boolean;

    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;
}
