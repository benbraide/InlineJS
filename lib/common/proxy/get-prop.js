"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProxyProp = void 0;
const find_1 = require("../component/find");
const get_1 = require("../global/get");
const proxy_keys_1 = require("../utilities/proxy-keys");
const create_child_1 = require("./create-child");
function GetProxyProp(componentId, proxy, target, path, prop, noResultHandler) {
    var _a, _b, _c;
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
            return path.split('.').slice(0, -1).join('.') || '';
        default:
            break;
    }
    if (prop in target) { //Property exists on target or its prototype
        if (!target.hasOwnProperty(prop)) { //Prop is inherited
            return target[prop]; //Return raw inherited value, do not track or proxy
        }
        //Property is on the instance
        const value = target[prop];
        if ((0, get_1.GetGlobal)().IsFuture(value)) { //No proxy representation
            return value.Get();
        }
        (_a = (0, get_1.GetGlobal)().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${path}.${prop}`); //Alert GET access
        if (typeof value === 'function') {
            return value.bind(proxy.GetNative());
        }
        const component = (0, find_1.FindComponentById)(componentId);
        if (!component) {
            return value;
        }
        return ((_b = (0, create_child_1.CreateChildProxy)((component.FindProxy(path) || null), prop, value, component)) === null || _b === void 0 ? void 0 : _b.GetNative()) || value;
    }
    if (noResultHandler) { //Property does not exist on target, try noResultHandler (for hx-locals, magic, etc.)
        const value = noResultHandler(((0, find_1.FindComponentById)(componentId) || undefined), prop);
        if (!(0, get_1.GetGlobal)().IsNothing(value)) { //Return raw value, do not track or proxy
            return (0, get_1.GetGlobal)().IsFuture(value) ? value.Get() : value;
        }
    }
    //Property not found anywhere, track access and return null as per design
    (_c = (0, get_1.GetGlobal)().GetCurrentProxyAccessStorage()) === null || _c === void 0 ? void 0 : _c.Put(componentId, `${path}.${prop}`); //Alert GET access
    return null;
}
exports.GetProxyProp = GetProxyProp;
