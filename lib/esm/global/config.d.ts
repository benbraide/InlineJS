import { IConfig, IConfigOptions, ReactiveStateType } from "../types/config";
export declare class Config implements IConfig {
    protected options_: IConfigOptions;
    protected defaultOptions_: IConfigOptions;
    private keyMap_;
    private booleanAttributes_;
    constructor(options_: IConfigOptions);
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
    MapKeyEvent(key: string): string | string[];
    AddBooleanAttribute(name: string): void;
    RemoveBooleanAttribute(name: string): void;
    IsBooleanAttribute(name: string): boolean;
    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;
    SetUseGlobalWindow(value: boolean): void;
    GetUseGlobalWindow(): boolean;
    protected UpdateDirectiveRegex_(): RegExp;
    SetWrapScopedFunctions(value: boolean): void;
    GetWrapScopedFunctions(): boolean;
}
