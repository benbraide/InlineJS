"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitComponentCache = exports.GetDefaultCacheValue = void 0;
const cache_1 = require("../utilities/cache");
const key_1 = require("./key");
function GetDefaultCacheValue() {
    return {
        id: '',
        component: null,
    };
}
exports.GetDefaultCacheValue = GetDefaultCacheValue;
function InitComponentCache() {
    (0, cache_1.InitCache)(key_1.ComponentCacheKey, GetDefaultCacheValue());
}
exports.InitComponentCache = InitComponentCache;
