"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProxyProp = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const proxy_keys_1 = require("../utilities/proxy-keys");
const create_child_1 = require("./create-child");
function GetProxyProp(componentId, target, path, prop, noResultHandler) {
    var _a;
    switch (prop) {
        case proxy_keys_1.ProxyKeys.target:
            return target;
        case proxy_keys_1.ProxyKeys.componentId:
            return componentId;
        case proxy_keys_1.ProxyKeys.name:
            return path.split('.').at(-1);
        case proxy_keys_1.ProxyKeys.path:
            return path;
        case proxy_keys_1.ProxyKeys.parentPath:
            return (path.split('.').slice(0, -1).join('.') || '');
        default:
            break;
    }
    const exists = (prop in target);
    if (!exists && noResultHandler) {
        const value = noResultHandler(((0, find_1.FindComponentById)(componentId) || undefined), prop);
        if (!(0, get_1.GetGlobal)().IsNothing(value)) {
            return ((0, get_1.GetGlobal)().IsFuture(value) ? value.Get() : value);
        }
    }
    if (exists && !target.hasOwnProperty(prop)) { //Prop not in this instance
        return target[prop];
    }
    const value = (exists ? target[prop] : null);
    if ((0, get_1.GetGlobal)().IsFuture(value)) { //No proxy representation
        return value.Get();
    }
    const component = (0, find_1.FindComponentById)(componentId);
    component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddGetAccess(`${path}.${prop}`); //Alert GET access
    return (((_a = (0, create_child_1.CreateChildProxy)(((component === null || component === void 0 ? void 0 : component.FindProxy(path)) || null), prop, value, (component || undefined))) === null || _a === void 0 ? void 0 : _a.GetNative()) || value);
}
exports.GetProxyProp = GetProxyProp;
