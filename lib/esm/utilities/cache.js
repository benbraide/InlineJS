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
    const scope = GetGlobalScope('cache');
    const cache = scope.hasOwnProperty(cacheKey) ? scope[cacheKey] : undefined;
    if (cache && typeof cache === 'object' && key in cache) {
        return cache[key];
    }
}
export function UseCache(callback, cacheKey, defaultValue, hitTest, onHit, onMiss) {
    let cache = GetCache(cacheKey, defaultValue);
    if (cache && hitTest(cache)) { //Cache hit
        return onHit(cache);
    }
    const newEntry = callback();
    if (newEntry === false) { // New entry is false - return default value
        return onMiss();
    }
    InitCache(cacheKey, newEntry); //Cache miss - add cache entry
    return onHit(newEntry);
}
export function InvalidateCache(cacheKey) {
    const scope = GetGlobalScope('cache');
    scope.hasOwnProperty(cacheKey) && delete scope[cacheKey];
}
