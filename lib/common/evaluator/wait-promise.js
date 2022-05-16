"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitPromise = void 0;
function WaitPromise(value, handler, recursive) {
    if (!(value instanceof Promise)) {
        return handler(value);
    }
    if (recursive) {
        value.then(value => WaitPromise(value, handler, true));
    }
    else { //Wait one
        value.then(handler);
    }
}
exports.WaitPromise = WaitPromise;
