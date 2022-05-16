"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitWhile = void 0;
const loop_1 = require("../values/loop");
function WaitWhile(value, handler, finalHandler) {
    if (value instanceof loop_1.Loop) {
        value.While(handler).Final((finalHandler === false) ? () => { } : (finalHandler || handler));
    }
    else {
        handler(value);
    }
}
exports.WaitWhile = WaitWhile;
