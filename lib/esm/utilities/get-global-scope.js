import { IsObject } from "./is-object";
export function GetGlobalScope(name = null, asObject = false) {
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));
    (name || '').trim().split('.').forEach((part) => {
        if (part) {
            scope = (scope[part] = ((scope[part] && IsObject(scope[part])) ? scope[part] : {}));
        }
    });
    return ((!asObject || IsObject(scope)) ? scope : {});
}
export function InitializeGlobalScope(name, value) {
    const scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
