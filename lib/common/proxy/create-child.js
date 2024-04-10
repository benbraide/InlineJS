"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChildProxy = void 0;
const get_1 = require("../global/get");
const is_object_1 = require("../utilities/is-object");
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
    if (component) { //Register to component
        component.AddProxy(proxy);
    }
    return proxy;
}
exports.CreateChildProxy = CreateChildProxy;
