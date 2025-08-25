import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
export function AddMagicHandler(handler) {
    let name = '', callback = null, onAccess = undefined;
    if (typeof handler === 'function') {
        // Differentiate between handler types by checking the number of arguments (arity)
        if (handler.length === 0) { // Assumed FunctionMagicHandlerType: () => IMagicHandlerCallbackDetails | void
            const response = handler();
            if (response) { // Details returned
                ({ name, callback, onAccess } = response);
            }
        }
        else { // Assumed WrappedFunctionMagicHandlerType: (key: 'name' | 'callback' | 'access') => ...
            name = handler('name');
            callback = handler('callback');
            onAccess = handler('access');
        }
    }
    else if (IsObject(handler)) { //Details provided
        ({ name, callback, onAccess } = handler);
    }
    else { //Instance provided
        GetGlobal().GetMagicManager().AddHandler(handler);
    }
    if (name && callback) {
        GetGlobal().GetMagicManager().AddHandler(callback, name, onAccess);
    }
}
