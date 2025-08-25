"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidateCache = exports.UseCache = exports.FindCacheValue = exports.SetCacheValue = exports.GetCache = exports.InitCache = void 0;
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
    const scope = (0, get_global_scope_1.GetGlobalScope)('cache');
    const cache = scope.hasOwnProperty(cacheKey) ? scope[cacheKey] : undefined;
    if (cache && typeof cache === 'object' && key in cache) {
        return cache[key];
    }
}
exports.FindCacheValue = FindCacheValue;
function UseCache(callback, cacheKey, defaultValue, hitTest, onHit, onMiss) {
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
exports.UseCache = UseCache;
function InvalidateCache(cacheKey) {
    const scope = (0, get_global_scope_1.GetGlobalScope)('cache');
    scope.hasOwnProperty(cacheKey) && delete scope[cacheKey];
}
exports.InvalidateCache = InvalidateCache;
