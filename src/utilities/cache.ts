import { GetGlobalScope } from "./get-global-scope";

export function InitCache<T = any>(key: string, value: T | (() => T)){
    const scope = GetGlobalScope('cache');
    return <T>(scope[key] = ((typeof value === 'function') ? (value as any)() : value));
}

export function GetCache<T = any>(key: string, defaultValue: T | (() => T)){
    const scope = GetGlobalScope('cache');
    return <T>(scope.hasOwnProperty(key) ? scope[key] : InitCache(key, defaultValue));
}

export function SetCacheValue<T = any>(cacheKey: string, key: string, value: any, defaultValue: T | (() => T)){
    const cache = GetCache(cacheKey, defaultValue);
    (cache && typeof cache === 'object') && (cache[key] = value);
}

export function FindCacheValue<T = any>(cacheKey: string, key: string){
    const cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    return (((cache && typeof cache === 'object' && key in cache)) ? <T>cache[key] : undefined);
}

export function UseCache<T = any, U = any>(callback: () => T, cacheKey: string, value: any, defaultValue: T | (() => T), getter?: (cache: T) => [any, U]){
    let cache = GetCache<T>(cacheKey, defaultValue);
    if (cache){
        const [ck, cv] = (getter ? getter(cache) : [cache, (cache as unknown as U)]);
        if (ck === value){//Cache hit
            return cv;
        }
    }

    InitCache(cacheKey, (cache = callback()));//Cache miss - add cache entry
    
    return (getter ? getter(cache)[1] : (cache as unknown as U));
}
