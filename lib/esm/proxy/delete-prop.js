import { FindComponentById } from "../component/find";
import { AddChanges } from "./add-changes";
export function DeleteProxyProp(componentId, target, path, prop) {
    var _a;
    const exists = (prop in target);
    if (!exists) {
        return false;
    }
    const component = FindComponentById(componentId);
    (_a = component === null || component === void 0 ? void 0 : component.FindProxy(path)) === null || _a === void 0 ? void 0 : _a.RemoveChild(prop); //Remove previous child proxy, if any
    delete target[prop];
    component === null || component === void 0 ? void 0 : component.RemoveProxy(`${path}.${prop}`);
    AddChanges('delete', `${path}.${prop}`, prop, component === null || component === void 0 ? void 0 : component.GetBackend().changes);
    return true;
}
