import { GetGlobal } from "../global/get";
import { DirectiveExpansionRuleType, DirectiveHandlerCallbackType, IDirectiveHandler, IDirectiveHandlerParams, IDirectiveManager } from "../types/directive";

interface IDirectiveHandlerComposition{
    handler: DirectiveHandlerCallbackType;
    extensions: Record<string, DirectiveHandlerCallbackType>;
}

function CreateComposedDirectiveHandler(originalHandler: DirectiveHandlerCallbackType): IDirectiveHandlerComposition{
    const composition: IDirectiveHandlerComposition = {
        handler: ({ argKey, ...rest }: IDirectiveHandlerParams) => {
            // Call extension if it exists
            if (composition.extensions.hasOwnProperty(argKey)){
                composition.extensions[argKey]({ argKey, ...rest });
            }
            else{ // Pass to main handler
                originalHandler({ argKey, ...rest });
            }
        },
        extensions: {},
    };

    return composition;
}

function AddDirectiveHandlerExtension(ref: DirectiveHandlerCallbackType | IDirectiveHandlerComposition, name: string, handler: DirectiveHandlerCallbackType){
    const info = ((typeof ref === 'function') ? CreateComposedDirectiveHandler(ref) : ref);
    info.extensions[name] = handler;
    return info;
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
        const id = GetGlobal().GenerateUniqueId('exrule_');
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

        for (const id in this.expansionRules_){
            const expanded = this.expansionRules_[id](name);
            if (expanded){
                return expanded;
            }
        }

        return name;
    }

    public AddHandler(handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string){
        const { computedName, callback } = ComputeNameAndCallback(handler, name);
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

        const info = this.handlers_[name];
        return ((typeof info === 'function') ? info : info.handler);
    }

    public AddHandlerExtension(target: string, handler: IDirectiveHandler | DirectiveHandlerCallbackType, name?: string){
        const info = (this.handlers_.hasOwnProperty(target) ? this.handlers_[target] : null);
        if (!info){
            return;
        }
        
        const { computedName, callback } = ComputeNameAndCallback(handler, name);
        if (computedName && callback){
            this.handlers_[target] =AddDirectiveHandlerExtension(info, computedName, callback);
        }
    }

    public RemoveHandlerExtension(target: string, name: string){
        const info = (this.handlers_.hasOwnProperty(target) ? this.handlers_[target] : null);
        if (info){
            RemoveDirectiveHandlerExtension(info, name);
        }
    }
}
