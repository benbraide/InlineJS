import { IsObject } from "./is-object";

export function GetGlobalScope(name: string | null = null, asObject = false){
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));

    name && (name = name.trim());
    name && name.split('.').forEach((part) => {
        scope = (scope[part] = (scope[part] || {}));
    });
    
    return ((!asObject || IsObject(scope)) ? scope : {});
}

export function InitializeGlobalScope(name: string | null, value: Record<string, any>){
    const scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
