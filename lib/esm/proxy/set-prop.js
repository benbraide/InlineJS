import { FindComponentById } from "../component/find";
import { AddChanges } from "./add-changes";
export function SetProxyProp(componentId, target, path, prop, value) {
    var _a;
    const exists = (prop in target);
    if (exists && value === target[prop]) { //No changes
        return true;
    }
    const component = FindComponentById(componentId);
    (_a = component === null || component === void 0 ? void 0 : component.FindProxy(path)) === null || _a === void 0 ? void 0 : _a.RemoveChild(prop); //Remove previous child proxy, if any
    target[prop] = value;
    component === null || component === void 0 ? void 0 : component.RemoveProxy(`${path}.${prop}`);
    AddChanges('set', `${path}.${prop}`, prop, component === null || component === void 0 ? void 0 : component.GetBackend().changes);
    return true;
}
