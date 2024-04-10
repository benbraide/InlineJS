"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetProxyProp = void 0;
const find_1 = require("../component/find");
const add_changes_1 = require("./add-changes");
function SetProxyProp(componentId, target, path, prop, value) {
    var _a;
    const exists = (prop in target);
    if (exists && value === target[prop]) { //No changes
        return true;
    }
    const component = (0, find_1.FindComponentById)(componentId);
    (_a = component === null || component === void 0 ? void 0 : component.FindProxy(path)) === null || _a === void 0 ? void 0 : _a.RemoveChild(prop); //Remove previous child proxy, if any
    target[prop] = value;
    component === null || component === void 0 ? void 0 : component.RemoveProxy(`${path}.${prop}`);
    (0, add_changes_1.AddChanges)('set', `${path}.${prop}`, prop, component === null || component === void 0 ? void 0 : component.GetBackend().changes);
    return true;
}
exports.SetProxyProp = SetProxyProp;
