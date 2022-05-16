"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProxyProp = void 0;
const find_1 = require("../component/find");
const add_changes_1 = require("./add-changes");
function DeleteProxyProp(componentId, target, path, prop) {
    var _a;
    let exists = (prop in target);
    if (!exists) {
        return false;
    }
    let component = (0, find_1.FindComponentById)(componentId);
    (_a = component === null || component === void 0 ? void 0 : component.FindProxy(path)) === null || _a === void 0 ? void 0 : _a.RemoveChild(prop); //Remove previous child proxy, if any
    delete target[prop];
    component === null || component === void 0 ? void 0 : component.RemoveProxy(`${path}.${prop}`);
    (0, add_changes_1.AddChanges)('delete', path, prop, component === null || component === void 0 ? void 0 : component.GetBackend().changes);
    return true;
}
exports.DeleteProxyProp = DeleteProxyProp;
