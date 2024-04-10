import { IComponent } from "./component";
import { IProxyAccessHandler } from "./proxy";
export interface IDirectiveView {
    original: string;
    expanded: string;
}
export interface IDirectiveName {
    value: string;
    joined: string;
    parts: Array<string>;
}
export interface IDirectiveArg {
    key: string;
    options: Array<string>;
}
export interface IDirectiveMeta {
    view: IDirectiveView;
    name: IDirectiveName;
    arg: IDirectiveArg;
}
export interface IDirectiveProxyAccessHandler {
    handler?: IProxyAccessHandler | null;
}
export interface IDirective {
    meta: IDirectiveMeta;
    value: string;
    proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null;
}
export interface IFlatDirective {
    originalView: string;
    expandedView: string;
    nameValue: string;
    nameJoined: string;
    nameParts: Array<string>;
    argKey: string;
    argOptions: Array<string>;
    expression: string;
    proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null;
}
export interface IDirectiveHandlerParams extends IFlatDirective {
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}
export type DirectiveHandlerCallbackType = ((params: IDirectiveHandlerParams) => void) | (() => void);
export interface IDirectiveHandlerCallbackDetails {
    name: string;
    callback: DirectiveHandlerCallbackType;
}
export type FunctionDirectiveHandlerType = () => IDirectiveHandlerCallbackDetails;
export type WrappedFunctionQueryType = 'nop' | 'name' | 'callback';
export type WrappedFunctionDirectiveHandlerType = (query?: WrappedFunctionQueryType) => DirectiveHandlerCallbackType | string | null;
export type DirectiveExpansionRuleType = (name: string) => string | null;
export interface IDirectiveHandler {
    GetName(): string;
    Handle: DirectiveHandlerCallbackType;
}
export interface IDirectiveManager {
    AddExpansionRule(rule: DirectiveExpansionRuleType): string;
    RemoveExpansionRule(id: string): void;
    Expand(name: string): string;
    AddHandler(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string): DirectiveHandlerCallbackType | null;
    AddHandlerExtension(target: string, handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string): void;
    RemoveHandlerExtension(target: string, name: string): void;
}
export interface ITraverseDirectivesParams {
    element: Element;
    callback: (directive: IDirective) => void;
    attributeCallback?: (name: string, value: string) => void;
    proxyAccessHandler?: IProxyAccessHandler | IDirectiveProxyAccessHandler | null;
}
