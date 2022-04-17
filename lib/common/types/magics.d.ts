import { IComponent } from "./component";
export interface IMagicHandlerParams {
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}
export declare type MagicHandlerCallbackType = ((params: IMagicHandlerParams) => any) | (() => any);
export interface IMagicHandlerCallbackDetails {
    name: string;
    callback: MagicHandlerCallbackType;
    onAccess?: MagicHandlerCallbackType;
}
export declare type FunctionMagicHandlerType = () => IMagicHandlerCallbackDetails;
export declare type WrappedFunctionQueryType = 'nop' | 'name' | 'callback' | 'access';
export declare type WrappedFunctionMagicHandlerType = (query?: WrappedFunctionQueryType) => MagicHandlerCallbackType | string | null;
export declare type DirectiveExpansionRuleType = (name: string) => string | null;
export interface IMagicHandler {
    GetName(): string;
    Handle: MagicHandlerCallbackType;
    OnAcces?: MagicHandlerCallbackType;
}
export interface IMagicManager {
    AddHandler(handler: IMagicHandler | MagicHandlerCallbackType, name?: string, onAccess?: MagicHandlerCallbackType): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string, accessParams?: IMagicHandlerParams): MagicHandlerCallbackType | null;
}
