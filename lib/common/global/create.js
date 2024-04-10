"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrCreateGlobal = exports.CreateGlobal = void 0;
const cache_1 = require("../component/cache");
const get_global_scope_1 = require("../utilities/get-global-scope");
const base_1 = require("./base");
const get_1 = require("./get");
const key_1 = require("./key");
function CreateGlobal(configOptions, idOffset = 0) {
    const global = new base_1.BaseGlobal(configOptions, idOffset);
    (0, cache_1.InitComponentCache)();
    (0, get_global_scope_1.InitializeGlobalScope)('global', {
        base: global,
    });
    window.dispatchEvent(new CustomEvent(key_1.GlobalCreatedEvent));
    return global;
}
exports.CreateGlobal = CreateGlobal;
function GetOrCreateGlobal(configOptions, idOffset = 0) {
    return ((0, get_1.GetGlobal)() || CreateGlobal(configOptions, idOffset));
}
exports.GetOrCreateGlobal = GetOrCreateGlobal;
