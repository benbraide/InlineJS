import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
export function AddMagicHandler(handler) {
    let name = '', callback = null, onAccess = undefined;
    if (typeof handler === 'function') {
        const response = handler();
        if (!response) { //Query name and callback
            name = handler('name');
            callback = handler('callback');
            onAccess = handler('access');
        }
        else { //Details returned
            ({ name, callback, onAccess } = response);
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
