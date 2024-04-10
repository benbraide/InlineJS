export type ReactiveStateType = 'default' | 'optimized' | 'unoptimized' | 'disabled';
export type DirectiveNameBuilderType = (name: string, addDataPrefix?: boolean) => string;

export interface IConfigOptions{
    appName?: string;
    useGlobalWindow?: boolean;
    wrapScopedFunctions?: boolean;
    reactiveState?: ReactiveStateType;
    directivePrefix?: string;
    elementPrefix?: string;
    directiveRegex?: RegExp;
    directiveNameBuilder?: DirectiveNameBuilderType;
}

export interface IConfig{
    GetAppName(): string;

    SetDirectivePrefix(value: string): void;
    GetDirectivePrefix(): string;

    SetElementPrefix(value: string): void;
    GetElementPrefix(): string;
    
    GetDirectiveRegex(): RegExp;
    GetDirectiveName(name: string, addDataPrefix?: boolean): string;
    GetElementName(name: string): string;

    AddKeyEventMap(key: string, target: string): void;
    RemoveKeyEventMap(key: string): void;
    MapKeyEvent(key: string): string | Array<string>;

    AddBooleanAttribute(name: string): void;
    RemoveBooleanAttribute(name: string): void;
    IsBooleanAttribute(name: string): boolean;

    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;

    SetUseGlobalWindow(value: boolean): void;
    GetUseGlobalWindow(): boolean;

    SetWrapScopedFunctions(value: boolean): void;
    GetWrapScopedFunctions(): boolean;
}
