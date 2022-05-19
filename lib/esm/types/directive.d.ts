import { IComponent } from "./component";
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
export interface IDirective {
    meta: IDirectiveMeta;
    value: string;
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
}
export interface IDirectiveHandlerParams extends IFlatDirective {
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}
export declare type DirectiveHandlerCallbackType = ((params: IDirectiveHandlerParams) => void) | (() => void);
export interface IDirectiveHandlerCallbackDetails {
    name: string;
    callback: DirectiveHandlerCallbackType;
}
export declare type FunctionDirectiveHandlerType = () => IDirectiveHandlerCallbackDetails;
export declare type WrappedFunctionQueryType = 'nop' | 'name' | 'callback';
export declare type WrappedFunctionDirectiveHandlerType = (query?: WrappedFunctionQueryType) => DirectiveHandlerCallbackType | string | null;
export declare type DirectiveExpansionRuleType = (name: string) => string | null;
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
}
