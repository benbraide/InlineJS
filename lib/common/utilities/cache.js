"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseCache = exports.FindCacheValue = exports.SetCacheValue = exports.GetCache = exports.InitCache = void 0;
const get_global_scope_1 = require("./get-global-scope");
function InitCache(key, value) {
    const scope = (0, get_global_scope_1.GetGlobalScope)('cache');
    return (scope[key] = ((typeof value === 'function') ? value() : value));
}
exports.InitCache = InitCache;
function GetCache(key, defaultValue) {
    const scope = (0, get_global_scope_1.GetGlobalScope)('cache');
    return (scope.hasOwnProperty(key) ? scope[key] : InitCache(key, defaultValue));
}
exports.GetCache = GetCache;
function SetCacheValue(cacheKey, key, value, defaultValue) {
    const cache = GetCache(cacheKey, defaultValue);
    (cache && typeof cache === 'object') && (cache[key] = value);
}
exports.SetCacheValue = SetCacheValue;
function FindCacheValue(cacheKey, key) {
    const cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    return (((cache && typeof cache === 'object' && key in cache)) ? cache[key] : undefined);
}
exports.FindCacheValue = FindCacheValue;
function UseCache(callback, cacheKey, value, defaultValue, getter) {
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
exports.UseCache = UseCache;
