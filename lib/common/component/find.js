"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindComponentByRoot = exports.FindComponentByName = exports.FindComponentById = exports.InitComponentCache = void 0;
const get_1 = require("../global/get");
const cache_1 = require("../utilities/cache");
const cacheKey = 'InlineJS_Comp_Cache';
function GetDefaultCacheValue() {
    return {
        id: '',
        component: null,
    };
}
function InitComponentCache() {
    (0, cache_1.InitCache)(cacheKey, GetDefaultCacheValue());
}
exports.InitComponentCache = InitComponentCache;
function FindComponentById(id) {
    let cache = (0, cache_1.GetCache)(cacheKey, GetDefaultCacheValue());
    if (id === cache.id) {
        return cache.component;
    }
    cache.component = (0, get_1.GetGlobal)().FindComponentById(id);
    cache.id = (cache.component ? id : '');
    return cache.component;
}
exports.FindComponentById = FindComponentById;
function FindComponentByName(name) {
    return (0, get_1.GetGlobal)().FindComponentByName(name);
}
exports.FindComponentByName = FindComponentByName;
function FindComponentByRoot(root) {
    return (0, get_1.GetGlobal)().FindComponentByRoot(root);
}
exports.FindComponentByRoot = FindComponentByRoot;
