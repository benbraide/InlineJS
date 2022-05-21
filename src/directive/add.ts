import { GetGlobal } from "../global/get";
import {
    DirectiveHandlerCallbackType,
    FunctionDirectiveHandlerType,
    IDirectiveHandler,
    IDirectiveHandlerCallbackDetails,
    WrappedFunctionDirectiveHandlerType
} from "../types/directive";
import { IsObject } from "../utilities/is-object";

export function AddDirectiveHandler(handler: IDirectiveHandler | IDirectiveHandlerCallbackDetails | FunctionDirectiveHandlerType | WrappedFunctionDirectiveHandlerType, target?: string){
    let name = '', callback: DirectiveHandlerCallbackType | null = null;
    if (typeof handler === 'function'){
        let response = handler();
        if (!response){//Query name and callback
            name = <string>(handler as WrappedFunctionDirectiveHandlerType)('name');
            callback = <DirectiveHandlerCallbackType>(handler as WrappedFunctionDirectiveHandlerType)('callback');
        }
        else{//Details returned
            ({name, callback} = <IDirectiveHandlerCallbackDetails>response);
        }
    }
    else if (IsObject(handler)){//Details provided
        ({name, callback} = <IDirectiveHandlerCallbackDetails>handler);
    }
    else{//Instance provided
        GetGlobal().GetDirectiveManager().AddHandler(<IDirectiveHandler>handler);
    }

    if (name && callback){
        if (target){
            GetGlobal().GetDirectiveManager().AddHandlerExtension(target, callback, name);
        }
        else{
            GetGlobal().GetDirectiveManager().AddHandler(callback, name);
        }
    }
}
