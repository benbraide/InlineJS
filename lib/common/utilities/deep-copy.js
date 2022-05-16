"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepCopy = void 0;
const get_target_1 = require("./get-target");
const is_object_1 = require("./is-object");
function DeepCopy(target) {
    target = (0, get_target_1.GetTarget)(target);
    if (!Array.isArray(target) && !(0, is_object_1.IsObject)(target)) {
        return target; //Value copy
    }
    if (Array.isArray(target)) {
        return target.map(item => DeepCopy(item));
    }
    let copy = {};
    Object.entries(target).forEach(([key, value]) => (copy[key] = DeepCopy(value)));
    return copy;
}
exports.DeepCopy = DeepCopy;
