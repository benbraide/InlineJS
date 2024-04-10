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
    if (typeof handler === 'function'){
        const response = handler();
        if (!response){//Query name and callback
            name = <string>(handler as WrappedFunctionMagicHandlerType)('name');
            callback = <MagicHandlerCallbackType>(handler as WrappedFunctionMagicHandlerType)('callback');
            onAccess = <MagicHandlerCallbackType>(handler as WrappedFunctionMagicHandlerType)('access');
        }
        else{//Details returned
            ({name, callback, onAccess} = <IMagicHandlerCallbackDetails>response);
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
