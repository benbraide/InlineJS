import { MagicHandlerCallbackType, IMagicHandler, IMagicManager, IMagicHandlerParams } from "../types/magic";

interface IHandlerInfo{
    callback: MagicHandlerCallbackType;
    onAccess?: MagicHandlerCallbackType;
}

export class MagicManager implements IMagicManager{
    private handlers_: Record<string, IHandlerInfo> = {};

    public AddHandler(handler: IMagicHandler | MagicHandlerCallbackType, name?: string, onAccess?: MagicHandlerCallbackType){
        let computedName = '', callback: MagicHandlerCallbackType | null = null;
        if (typeof handler === 'function'){
            computedName = (name || '');
            callback = handler;
        }
        else{//Instance specified
            computedName = handler.GetName();
            callback = (params) => handler.Handle(params);
        }

        if (computedName){
            this.handlers_[computedName] = { callback, onAccess };
        }
    }

    public RemoveHandler(name: string){
        if (name in this.handlers_){
            delete this.handlers_[name];
        }
    }

    public FindHandler(name: string, accessParams?: IMagicHandlerParams): MagicHandlerCallbackType | null{
        if (!(name in this.handlers_)){
            return null;
        }

        if (accessParams && this.handlers_[name].onAccess){
            this.handlers_[name].onAccess!(accessParams);
        }
        
        return this.handlers_[name].callback;
    }
}
