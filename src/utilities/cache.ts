export function InitCache<T = any>(key: string, value: T){
    return <T>(globalThis[key] = value);
}

export function GetCache<T = any>(key: string, defaultValue: T){
    return <T>(globalThis[key] = (globalThis[key] || InitCache<T>(key, defaultValue)));
}

export function SetCacheValue(cacheKey: string, key: string, value: any, defaultValue: any){
    let cache = GetCache(cacheKey, defaultValue);
    if (typeof cache === 'object'){
        cache[key] = value;
    }
}

export function FindCacheValue<T = any>(cacheKey: string, key: string){
    let cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    if (cache && typeof cache === 'object' && key in cache){
        return <T>cache[key];
    }

    return undefined;
}
