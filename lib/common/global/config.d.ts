import { IConfig, IConfigOptions, ReactiveStateType } from "../types/config";
export declare class Config implements IConfig {
    private appName_;
    private reactiveState_;
    private directiveRegex_;
    private directiveNameBuilder_;
    private keyMap_;
    private booleanAttributes_;
    constructor({ appName, reactiveState, directivePrefix, directiveRegex, directiveNameBuilder }?: IConfigOptions);
    GetAppName(): string;
    GetDirectiveRegex(): RegExp;
    GetDirectiveName(name: string, addDataPrefix?: boolean): string;
    AddKeyEventMap(key: string, target: string): void;
    RemoveKeyEventMap(key: string): void;
    MapKeyEvent(key: string): string;
    AddBooleanAttribute(name: string): void;
    RemoveBooleanAttribute(name: string): void;
    IsBooleanAttribute(name: string): boolean;
    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;
}
