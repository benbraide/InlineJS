import { IComponent } from "./component";
import { IDirectiveProxyAccessHandler } from "./directive";
import { IProxyAccessHandler } from "./proxy";

export interface IProcessOptions{
    checkTemplate?: boolean;
    checkDocument?: boolean;
    ignoreChildren?: boolean;
}

export interface IProcessDetails{
    component: IComponent | string;
    element: Element;
    options?: IProcessOptions;
    proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null;
}

interface IProcessorParams{
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
    proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null;
}

export interface IAttributeProcessorParams extends IProcessorParams{
    name: string;
    value: string;
}

export interface ITextContentProcessorParams extends IProcessorParams{}

export type AttributeProcessorType = (params: IAttributeProcessorParams) => void;
export type TextContentProcessorType = (params: ITextContentProcessorParams) => void;
