import { GetGlobal } from "../global/get";
import {
    MagicHandlerCallbackType,
    FunctionMagicHandlerType,
    IMagicHandler,
    IMagicHandlerCallbackDetails,
    WrappedFunctionMagicHandlerType
} from "../types/magic";
import { IsObject } from "../utilities/is-object";

export function AddMagicHandler(handler: IMagicHandler | IMagicHandlerCallbackDetails | FunctionMagicHandlerType | WrappedFunctionMagicHandlerType){
    let name = '', callback: MagicHandlerCallbackType | null = null, onAccess: MagicHandlerCallbackType | undefined = undefined;
    if (typeof handler === 'function') {
        // Differentiate between handler types by checking the number of arguments (arity)
        if (handler.length === 0) { // Assumed FunctionMagicHandlerType: () => IMagicHandlerCallbackDetails | void
            const response = (handler as FunctionMagicHandlerType)();
            if (response) { // Details returned
                ({ name, callback, onAccess } = response);
            }
        }
        else { // Assumed WrappedFunctionMagicHandlerType: (key: 'name' | 'callback' | 'access') => ...
            name = (handler as WrappedFunctionMagicHandlerType)('name') as string;
            callback = (handler as WrappedFunctionMagicHandlerType)('callback') as MagicHandlerCallbackType;
            onAccess = (handler as WrappedFunctionMagicHandlerType)('access') as MagicHandlerCallbackType | undefined;
        }
    }
    else if (IsObject(handler)){//Details provided
        ({name, callback, onAccess} = <IMagicHandlerCallbackDetails>handler);
    }
    else{//Instance provided
        GetGlobal().GetMagicManager().AddHandler(<IMagicHandler>handler);
    }

    if (name && callback){
        GetGlobal().GetMagicManager().AddHandler(callback, name, onAccess);
    }
}
