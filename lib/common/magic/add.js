"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMagicHandler = void 0;
const get_1 = require("../global/get");
const is_object_1 = require("../utilities/is-object");
function AddMagicHandler(handler) {
    let name = '', callback = null, onAccess = undefined;
    if (typeof handler === 'function') {
        let response = handler();
        if (!response) { //Query name and callback
            name = handler('name');
            callback = handler('callback');
            onAccess = handler('access');
        }
        else { //Details returned
            ({ name, callback, onAccess } = response);
        }
    }
    else if ((0, is_object_1.IsObject)(handler)) { //Details provided
        ({ name, callback, onAccess } = handler);
    }
    else { //Instance provided
        (0, get_1.GetGlobal)().GetMagicManager().AddHandler(handler);
    }
    if (name && callback) {
        (0, get_1.GetGlobal)().GetMagicManager().AddHandler(callback, name, onAccess);
    }
}
exports.AddMagicHandler = AddMagicHandler;
