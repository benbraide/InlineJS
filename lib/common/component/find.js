"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindComponentByCallback = exports.FindComponentByRoot = exports.FindComponentByName = exports.FindComponentById = void 0;
const get_1 = require("../global/get");
const cache_1 = require("../utilities/cache");
const cache_2 = require("./cache");
const key_1 = require("./key");
function FindComponentById(id) {
    return (0, cache_1.UseCache)(() => {
        const component = (0, get_1.GetGlobal)().FindComponentById(id);
        return component ? { id, component } : false;
    }, key_1.ComponentCacheKey, cache_2.GetDefaultCacheValue, cache => cache.id === id, cache => cache.component, () => null);
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
function FindComponentByCallback(callback) {
    return (0, get_1.GetGlobal)().FindComponentByCallback(callback);
}
exports.FindComponentByCallback = FindComponentByCallback;
