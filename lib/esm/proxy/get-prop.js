import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { ProxyKeys } from "../utilities/proxy-keys";
import { CreateChildProxy } from "./create-child";
export function GetProxyProp(componentId, target, path, prop, noResultHandler) {
    var _a;
    switch (prop) {
        case ProxyKeys.target:
            return target;
        case ProxyKeys.componentId:
            return componentId;
        case ProxyKeys.name:
            return path.split('.').at(-1);
        case ProxyKeys.path:
            return path;
        case ProxyKeys.parentPath:
            return (path.split('.').slice(0, -1).join('.') || '');
        default:
            break;
    }
    const exists = (prop in target);
    if (!exists && noResultHandler) {
        const value = noResultHandler((FindComponentById(componentId) || undefined), prop);
        if (!GetGlobal().IsNothing(value)) {
            return (GetGlobal().IsFuture(value) ? value.Get() : value);
        }
    }
    if (exists && !target.hasOwnProperty(prop)) { //Prop not in this instance
        return target[prop];
    }
    const value = (exists ? target[prop] : null);
    if (GetGlobal().IsFuture(value)) { //No proxy representation
        return value.Get();
    }
    const component = FindComponentById(componentId);
    component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddGetAccess(`${path}.${prop}`); //Alert GET access
    return (((_a = CreateChildProxy(((component === null || component === void 0 ? void 0 : component.FindProxy(path)) || null), prop, value, (component || undefined))) === null || _a === void 0 ? void 0 : _a.GetNative()) || value);
}
