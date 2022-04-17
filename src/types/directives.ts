import { IComponent } from "./component";
import { IFlatDirective } from "./directive";

export interface IDirectiveHandlerParams extends IFlatDirective{
    contextElement: HTMLElement;
    componentId: string;
    component?: IComponent;
}

export type DirectiveHandlerCallbackType = ((params: IDirectiveHandlerParams) => void) | (() => void);

export interface IDirectiveHandlerCallbackDetails{
    name: string;
    callback: DirectiveHandlerCallbackType;
}

export type FunctionDirectiveHandlerType = () => IDirectiveHandlerCallbackDetails;

export type WrappedFunctionQueryType = 'nop' | 'name' | 'callback';

export type WrappedFunctionDirectiveHandlerType = (query?: WrappedFunctionQueryType) => DirectiveHandlerCallbackType | string | null;

export type DirectiveExpansionRuleType = (name: string) => string | null;

export interface IDirectiveHandler{
    GetName(): string;
    Handle: DirectiveHandlerCallbackType;
}

export interface IDirectiveManager{
    AddExpansionRule(rule: DirectiveExpansionRuleType): string;
    RemoveExpansionRule(id: string): void;
    Expand(name: string): string;
    AddHandler(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string): DirectiveHandlerCallbackType | null;
}
