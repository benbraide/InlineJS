import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
export function CreateChildProxy(owner, name, target, component) {
    if (!owner) {
        return null;
    }
    const child = owner.FindChild(name);
    if (child) {
        return child;
    }
    if ((!Array.isArray(target) && !IsObject(target))) {
        return null;
    }
    const proxy = GetGlobal().CreateChildProxy(owner, name, target);
    if (component) { //Register to component
        component.AddProxy(proxy);
    }
    return proxy;
}
