export function InitCache(key, value) {
    return (globalThis[key] = value);
}
export function GetCache(key, defaultValue) {
    return (globalThis[key] = (globalThis[key] || InitCache(key, defaultValue)));
}
export function SetCacheValue(cacheKey, key, value, defaultValue) {
    let cache = GetCache(cacheKey, defaultValue);
    if (typeof cache === 'object') {
        cache[key] = value;
    }
}
export function FindCacheValue(cacheKey, key) {
    let cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    if (cache && typeof cache === 'object' && key in cache) {
        return cache[key];
    }
    return undefined;
}
