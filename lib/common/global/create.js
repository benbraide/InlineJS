"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrCreateGlobal = exports.CreateGlobal = exports.InlineJSGlobalKey = void 0;
const find_1 = require("../component/find");
const base_1 = require("./base");
const get_1 = require("./get");
exports.InlineJSGlobalKey = '__InlineJS_GLOBAL_KEY__';
function CreateGlobal(configOptions, idOffset = 0) {
    (0, find_1.InitComponentCache)();
    globalThis[exports.InlineJSGlobalKey] = new base_1.BaseGlobal(configOptions, idOffset);
    (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}))['global'] = globalThis[exports.InlineJSGlobalKey];
    window.dispatchEvent(new CustomEvent(get_1.GlobalCreatedEvent));
    return globalThis[exports.InlineJSGlobalKey];
}
exports.CreateGlobal = CreateGlobal;
function GetOrCreateGlobal(configOptions, idOffset = 0) {
    return ((0, get_1.GetGlobal)() || CreateGlobal(configOptions, idOffset));
}
exports.GetOrCreateGlobal = GetOrCreateGlobal;
