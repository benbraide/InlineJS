import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
export function AddDirectiveHandler(handler, target) {
    let name = '', callback = null;
    if (typeof handler === 'function') {
        // Differentiate between handler types by checking the number of arguments (arity)
        if (handler.length === 0) { // Assumed FunctionDirectiveHandlerType: () => IDirectiveHandlerCallbackDetails | void
            const response = handler();
            if (response) { // Details returned
                ({ name, callback } = response);
            }
        }
        else { // Assumed WrappedFunctionDirectiveHandlerType: (key: 'name' | 'callback') => ...
            name = handler('name');
            callback = handler('callback');
        }
    }
    else if (IsObject(handler)) { //Details provided
        ({ name, callback } = handler);
    }
    else { //Instance provided
        GetGlobal().GetDirectiveManager().AddHandler(handler);
    }
    if (name && callback) {
        if (target) {
            GetGlobal().GetDirectiveManager().AddHandlerExtension(target, callback, name);
        }
        else {
            GetGlobal().GetDirectiveManager().AddHandler(callback, name);
        }
    }
}
