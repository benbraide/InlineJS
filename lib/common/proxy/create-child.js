"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChildProxy = void 0;
const get_1 = require("../global/get");
const is_object_1 = require("../utilities/is-object");
const find_1 = require("../component/find");
function CreateChildProxy(owner, name, target, component) {
    if (!owner) {
        return null;
    }
    const child = owner.FindChild(name);
    if (child) {
        return child;
    }
    if ((!Array.isArray(target) && !(0, is_object_1.IsObject)(target))) {
        return null;
    }
    const proxy = (0, get_1.GetGlobal)().CreateChildProxy(owner, name, target);
    const resolvedComponent = (component || (0, find_1.FindComponentById)(owner.GetComponentId()));
    if (resolvedComponent) { //Register to component
        resolvedComponent.AddProxy(proxy);
    }
    return proxy;
}
exports.CreateChildProxy = CreateChildProxy;
