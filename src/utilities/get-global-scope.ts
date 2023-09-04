export function GetGlobalScope(name: string){
    let scope = (globalThis['InlineJS'] = (globalThis['InlineJS'] || {}));

    name = name.trim();
    name && name.split('.').forEach((part) => {
        scope = (scope[part] = (scope[part] || {}));
    });
    
    return scope;
}

export function InitializeGlobalScope(name: string, value: Record<string, any>){
    let scope = GetGlobalScope(name);
    Object.entries(value).forEach(([k, v]) => (scope[k] = v));
}
