"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeGlobalScope = exports.GetGlobalScope = void 0;
const is_object_1 = require("./is-object");
function GetGlobalScope(name = null, asObject = false) {
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));
    name && (name = name.trim());
    name && name.split('.').forEach((part) => {
        scope = (scope[part] = (scope[part] || {}));
    });
    return ((!asObject || (0, is_object_1.IsObject)(scope)) ? scope : {});
}
exports.GetGlobalScope = GetGlobalScope;
function InitializeGlobalScope(name, value) {
    const scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
exports.InitializeGlobalScope = InitializeGlobalScope;
