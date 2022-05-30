var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
export function CreateInplaceProxy({ target, getter, setter, deleter, lookup, alert }) {
    let handler = {
        get(target, prop) {
            var _a;
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')) {
                return Reflect.get(target, prop);
            }
            let value = (getter ? getter(prop.toString(), target) : target[prop]);
            if (!GetGlobal().IsNothing(value)) {
                if (alert && (!alert.list || prop in alert.list)) {
                    (_a = FindComponentById(alert.componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${alert.id}.${prop}`);
                }
                return value;
            }
            return Reflect.get(target, prop);
        },
        set(target, prop, value) {
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')) {
                return Reflect.set(target, prop, value);
            }
            return (setter ? (setter(prop.toString(), value, target) !== false) : (!!target[prop] || true));
        },
        deleteProperty(target, prop) {
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')) {
                return Reflect.deleteProperty(target, prop);
            }
            return (deleter ? (deleter(prop.toString(), target) !== false) : (!!(delete target[prop]) || true));
        },
        has(target, prop) {
            if (Reflect.has(target, prop)) {
                return true;
            }
            if (Array.isArray(lookup)) {
                return lookup.includes(prop.toString());
            }
            return (lookup ? lookup(prop.toString(), target) : (prop in target));
        }
    };
    return new window.Proxy((target || {}), handler);
}
export function CreateReadonlyProxy(target) {
    return CreateInplaceProxy(BuildGetterProxyOptions({ getter: prop => ((prop && prop in target && target[prop]) || null), lookup: [...Object.keys(target)] }));
}
export function DisableProxyAction() {
    return false;
}
export function BuildProxyOptions(_a) {
    var { setter, deleter, lookup } = _a, rest = __rest(_a, ["setter", "deleter", "lookup"]);
    return Object.assign(Object.assign({}, rest), { setter: (setter || DisableProxyAction), deleter: (deleter || DisableProxyAction), lookup: (lookup || DisableProxyAction) });
}
export function BuildGetterProxyOptions(options) {
    return BuildProxyOptions(options);
}
