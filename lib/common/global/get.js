"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitForGlobal = exports.GetGlobal = exports.GlobalCreatedEvent = void 0;
const create_1 = require("./create");
exports.GlobalCreatedEvent = 'inlinejs.global.created';
function GetGlobal() {
    return globalThis[create_1.InlineJSGlobalKey];
}
exports.GetGlobal = GetGlobal;
function WaitForGlobal() {
    return (GetGlobal() ? Promise.resolve() : new Promise(resolve => window.addEventListener(exports.GlobalCreatedEvent, resolve)));
}
exports.WaitForGlobal = WaitForGlobal;
