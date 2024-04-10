import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
export function AddDirectiveHandler(handler, target) {
    let name = '', callback = null;
    if (typeof handler === 'function') {
        const response = handler();
        if (!response) { //Query name and callback
            name = handler('name');
            callback = handler('callback');
        }
        else { //Details returned
            ({ name, callback } = response);
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
