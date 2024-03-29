import { DirectiveExpansionRuleType, DirectiveHandlerCallbackType, IDirectiveHandler, IDirectiveManager } from "../types/directive";
export declare class DirectiveManager implements IDirectiveManager {
    private expansionRules_;
    private handlers_;
    AddExpansionRule(rule: DirectiveExpansionRuleType): string;
    RemoveExpansionRule(id: string): void;
    Expand(name: string): string;
    AddHandler(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string): void;
    RemoveHandler(name: string): void;
    FindHandler(name: string): DirectiveHandlerCallbackType | null;
    AddHandlerExtension(target: string, handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string): void;
    RemoveHandlerExtension(target: string, name: string): void;
}
