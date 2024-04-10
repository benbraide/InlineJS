import { IsObject } from "./is-object";
export function GetGlobalScope(name = null, asObject = false) {
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));
    name && (name = name.trim());
    name && name.split('.').forEach((part) => {
        scope = (scope[part] = (scope[part] || {}));
    });
    return ((!asObject || IsObject(scope)) ? scope : {});
}
export function InitializeGlobalScope(name, value) {
    const scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
