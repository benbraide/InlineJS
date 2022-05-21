import { GetGlobal } from "../global/get";
import { DirectiveExpansionRuleType, DirectiveHandlerCallbackType, IDirectiveHandler, IDirectiveHandlerParams, IDirectiveManager } from "../types/directive";

interface IDirectiveHandlerComposition{
    handler: DirectiveHandlerCallbackType;
    extensions: Record<string, DirectiveHandlerCallbackType>;
}

function CreateComposedDirectiveHandler(handler: DirectiveHandlerCallbackType){
    return <IDirectiveHandlerComposition>{
        handler({ argKey, ...rest }: IDirectiveHandlerParams){
            if (this.extensions.hasOwnProperty(argKey)){
                this.extensions[argKey]({ argKey, ...rest });
            }
            else{//Pass to main handler
                handler({ argKey, ...rest });
            }
        },
        extensions: {},
    };
}

function AddDirectiveHandlerExtension(ref: DirectiveHandlerCallbackType | IDirectiveHandlerComposition, name: string, handler: DirectiveHandlerCallbackType){
    let info = ((typeof ref === 'function') ? CreateComposedDirectiveHandler(ref) : ref);
    info.extensions[name] = handler;
}

function RemoveDirectiveHandlerExtension(ref: DirectiveHandlerCallbackType | IDirectiveHandlerComposition, name: string){
    if (typeof ref !== 'function' && ref.extensions.hasOwnProperty(name)){
        delete ref.extensions[name];
    }
}

function ComputeNameAndCallback(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string){
    let computedName = '', callback: DirectiveHandlerCallbackType | null = null;
    if (typeof handler === 'function'){
        computedName = (name || '');
        callback = handler;
    }
    else{//Instance specified
        computedName = handler.GetName();
        callback = (params) => handler.Handle(params);
    }

    return { computedName, callback };
}

export class DirectiveManager implements IDirectiveManager{
    private expansionRules_: Record<string, DirectiveExpansionRuleType> = {};
    private handlers_: Record<string, DirectiveHandlerCallbackType | IDirectiveHandlerComposition> = {};

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
        let { computedName, callback } = ComputeNameAndCallback(handler, name);
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
        if (!this.handlers_.hasOwnProperty(name)){
            return null;
        }

        let info = this.handlers_[name];
        return ((typeof info === 'function') ? info : info.handler);
    }

    public AddHandlerExtension(target: string, handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string){
        let info = (this.handlers_.hasOwnProperty(target) ? this.handlers_[target] : null);
        if (!info){
            return;
        }
        
        let { computedName, callback } = ComputeNameAndCallback(handler, name);
        if (computedName && callback){
            AddDirectiveHandlerExtension(info, computedName, callback);
        }
    }

    public RemoveHandlerExtension(target: string, name: string){
        let info = (this.handlers_.hasOwnProperty(target) ? this.handlers_[target] : null);
        if (info){
            RemoveDirectiveHandlerExtension(info, name);
        }
        
    }
}
