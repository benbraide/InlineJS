import { GetGlobal } from "../global/get";
import { IsObject } from "../utilities/is-object";
import { FindComponentById } from "../component/find";
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
    const resolvedComponent = (component || FindComponentById(owner.GetComponentId()));
    if (resolvedComponent) { //Register to component
        resolvedComponent.AddProxy(proxy);
    }
    return proxy;
}
