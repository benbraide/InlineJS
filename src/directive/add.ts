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
    if (typeof handler === 'function') {
        // Differentiate between handler types by checking the number of arguments (arity)
        if (handler.length === 0) { // Assumed FunctionDirectiveHandlerType: () => IDirectiveHandlerCallbackDetails | void
            const response = (handler as FunctionDirectiveHandlerType)();
            if (response) { // Details returned
                ({ name, callback } = response);
            }
        }
        else { // Assumed WrappedFunctionDirectiveHandlerType: (key: 'name' | 'callback') => ...
            name = (handler as WrappedFunctionDirectiveHandlerType)('name') as string;
            callback = (handler as WrappedFunctionDirectiveHandlerType)('callback') as DirectiveHandlerCallbackType;
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
