"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeGlobalScope = exports.GetGlobalScope = void 0;
function GetGlobalScope(name) {
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));
    name = name.trim();
    name && name.split('.').forEach((part) => {
        scope = (scope[part] = (scope[part] || {}));
    });
    return scope;
}
exports.GetGlobalScope = GetGlobalScope;
function InitializeGlobalScope(name, value) {
    let scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
exports.InitializeGlobalScope = InitializeGlobalScope;
