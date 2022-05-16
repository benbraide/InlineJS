"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreObjects = exports.IsObject = void 0;
const get_target_1 = require("./get-target");
const proxy_keys_1 = require("./proxy-keys");
function IsObject_(target) {
    target = (0, get_target_1.GetTarget)(target);
    return (target && typeof target === 'object' && ((proxy_keys_1.ProxyKeys.target in target) || ('__proto__' in target && target['__proto__'].constructor.name === 'Object')));
}
function IsObject(target) {
    return !!IsObject_(target);
}
exports.IsObject = IsObject;
function AreObjects(targets) {
    return (targets.findIndex(item => !IsObject_(item)) == -1);
}
exports.AreObjects = AreObjects;
