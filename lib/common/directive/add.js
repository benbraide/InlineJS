"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDirectiveHandler = void 0;
const get_1 = require("../global/get");
const is_object_1 = require("../utilities/is-object");
function AddDirectiveHandler(handler, target) {
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
    else if ((0, is_object_1.IsObject)(handler)) { //Details provided
        ({ name, callback } = handler);
    }
    else { //Instance provided
        (0, get_1.GetGlobal)().GetDirectiveManager().AddHandler(handler);
    }
    if (name && callback) {
        if (target) {
            (0, get_1.GetGlobal)().GetDirectiveManager().AddHandlerExtension(target, callback, name);
        }
        else {
            (0, get_1.GetGlobal)().GetDirectiveManager().AddHandler(callback, name);
        }
    }
}
exports.AddDirectiveHandler = AddDirectiveHandler;
