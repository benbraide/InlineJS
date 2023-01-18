import { IConfig, IConfigOptions, ReactiveStateType } from "../types/config";
export declare class Config implements IConfig {
    private appName_;
    private reactiveState_;
    private directivePrefix_;
    private elementPrefix_;
    private directiveRegex_;
    private directiveNameBuilder_;
    private keyMap_;
    private booleanAttributes_;
    constructor({ appName, reactiveState, directivePrefix, elementPrefix, directiveRegex, directiveNameBuilder }?: IConfigOptions);
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
}
