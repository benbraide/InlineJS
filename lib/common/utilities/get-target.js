"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTargets = exports.GetTarget = void 0;
const proxy_keys_1 = require("./proxy-keys");
function GetTarget(target) {
    return (((Array.isArray(target) || (target && typeof target === 'object')) && proxy_keys_1.ProxyKeys.target in target) ? GetTarget(target[proxy_keys_1.ProxyKeys.target]) : target);
}
exports.GetTarget = GetTarget;
function GetTargets(targets) {
    return targets.map(target => GetTarget(target));
}
exports.GetTargets = GetTargets;
