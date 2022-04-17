import { GetGlobal } from "../global/get";
import { DirectiveExpansionRuleType, DirectiveHandlerCallbackType, IDirectiveHandler, IDirectiveManager } from "../types/directives";

export class DirectiveManager implements IDirectiveManager{
    private expansionRules_: Record<string, DirectiveExpansionRuleType> = {};
    private handlers_: Record<string, DirectiveHandlerCallbackType> = {};

    public AddExpansionRule(rule: DirectiveExpansionRuleType){
        let id = GetGlobal().GenerateUniqueId('exrule_');
        this.expansionRules_[id] = rule;
        return id;
    }

    public RemoveExpansionRule(id: string){
        if (id in this.expansionRules_){
            delete this.expansionRules_[id];
        }
    }
    
    public Expand(name: string){
        if (!(name = name.trim())){
            return name;
        }

        for (let id in this.expansionRules_){
            let expanded = this.expansionRules_[id](name);
            if (expanded){
                return expanded;
            }
        }

        return name;
    }

    public AddHandler(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string){
        let computedName = '', callback: DirectiveHandlerCallbackType | null = null;
        if (typeof handler === 'function'){
            computedName = (name || '');
            callback = handler;
        }
        else{//Instance specified
            computedName = handler.GetName();
            callback = (params) => handler.Handle(params);
        }

        if (computedName && callback){
            this.handlers_[computedName] = callback;
        }
    }

    public RemoveHandler(name: string){
        if (name in this.handlers_){
            delete this.handlers_[name];
        }
    }

    public FindHandler(name: string): DirectiveHandlerCallbackType | null{
        return ((name in this.handlers_) ? this.handlers_[name] : null);
    }
}
