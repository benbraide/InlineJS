"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCacheValue = exports.SetCacheValue = exports.GetCache = exports.InitCache = void 0;
function InitCache(key, value) {
    return (globalThis[key] = value);
}
exports.InitCache = InitCache;
function GetCache(key, defaultValue) {
    return (globalThis[key] = (globalThis[key] || InitCache(key, defaultValue)));
}
exports.GetCache = GetCache;
function SetCacheValue(cacheKey, key, value, defaultValue) {
    let cache = GetCache(cacheKey, defaultValue);
    if (typeof cache === 'object') {
        cache[key] = value;
    }
}
exports.SetCacheValue = SetCacheValue;
function FindCacheValue(cacheKey, key) {
    let cache = ((cacheKey in globalThis && globalThis[cacheKey]) || null);
    if (cache && typeof cache === 'object' && key in cache) {
        return cache[key];
    }
    return undefined;
}
exports.FindCacheValue = FindCacheValue;
