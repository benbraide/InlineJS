import { GetGlobalScope } from "./get-global-scope";
export function InitCache(key, value) {
    const scope = GetGlobalScope('cache');
    return (scope[key] = ((typeof value === 'function') ? value() : value));
}
export function GetCache(key, defaultValue) {
    const scope = GetGlobalScope('cache');
    return (scope.hasOwnProperty(key) ? scope[key] : InitCache(key, defaultValue));
}
export function SetCacheValue(cacheKey, key, value, defaultValue) {
    const cache = GetCache(cacheKey, defaultValue);
    (cache && typeof cache === 'object') && (cache[key] = value);
}
export function FindCacheValue(cacheKey, key) {
    const cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    return (((cache && typeof cache === 'object' && key in cache)) ? cache[key] : undefined);
}
export function UseCache(callback, cacheKey, value, defaultValue, getter) {
    let cache = GetCache(cacheKey, defaultValue);
    if (cache) {
        const [ck, cv] = (getter ? getter(cache) : [cache, cache]);
        if (ck === value) { //Cache hit
            return cv;
        }
    }
    InitCache(cacheKey, (cache = callback())); //Cache miss - add cache entry
    return (getter ? getter(cache)[1] : cache);
}
