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

export function FindCacheValue<T = any>(cacheKey: string, key: string): T | undefined{
    const scope = GetGlobalScope('cache');
    const cache = scope.hasOwnProperty(cacheKey) ? scope[cacheKey] : undefined;
    if (cache && typeof cache === 'object' && key in cache){
        return cache[key];
    }
}

export function UseCache<T = any, U = any>(callback: () => T | false, cacheKey: string, defaultValue: T | (() => T), hitTest: (cache: T) => boolean, onHit: (cache: T) => U, onMiss: () => U){
    let cache = GetCache<T>(cacheKey, defaultValue);
    if (cache && hitTest(cache)) { //Cache hit
        return onHit(cache);
    }

    const newEntry = callback();
    if (newEntry === false){// New entry is false - return default value
        return onMiss();
    }
    
    InitCache(cacheKey, newEntry);//Cache miss - add cache entry
    
    return onHit(newEntry);
}

export function InvalidateCache(cacheKey: string){
    const scope = GetGlobalScope('cache');
    scope.hasOwnProperty(cacheKey) && delete scope[cacheKey];
}
