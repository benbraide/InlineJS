import { IComponent } from "./component";

export interface IMagicHandlerParams{
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}

export type MagicHandlerCallbackType = ((params: IMagicHandlerParams) => any) | (() => any);

export interface IMagicHandlerCallbackDetails{
    name: string;
    callback: MagicHandlerCallbackType;
    onAccess?: MagicHandlerCallbackType;
}

export type FunctionMagicHandlerType = () => IMagicHandlerCallbackDetails;

export type WrappedMagicFunctionQueryType = 'nop' | 'name' | 'callback' | 'access';

export type WrappedFunctionMagicHandlerType = (query?: WrappedMagicFunctionQueryType) => MagicHandlerCallbackType | string | null;

export interface IMagicHandler{
    GetName(): string;
    Handle: MagicHandlerCallbackType;
    OnAcces?: MagicHandlerCallbackType;
}

export interface IMagicManager{
    AddHandler(handler: IMagicHandler | MagicHandlerCallbackType, name?: string, onAccess?: MagicHandlerCallbackType): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string, accessParams?: IMagicHandlerParams): MagicHandlerCallbackType | null;
}
