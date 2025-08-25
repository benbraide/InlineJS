"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitForGlobal = exports.GetGlobal = void 0;
const get_global_scope_1 = require("../utilities/get-global-scope");
const key_1 = require("./key");
function GetGlobal() {
    return ((0, get_global_scope_1.GetGlobalScope)('global')['base'] || null);
}
exports.GetGlobal = GetGlobal;
function WaitForGlobal() {
    return (GetGlobal() ? Promise.resolve() : new Promise(resolve => window.addEventListener(key_1.GlobalCreatedEvent, resolve, { once: true })));
}
exports.WaitForGlobal = WaitForGlobal;
