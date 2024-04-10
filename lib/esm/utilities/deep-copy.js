import { GetTarget } from "./get-target";
import { IsObject } from "./is-object";
export function DeepCopy(target) {
    target = GetTarget(target);
    if (!Array.isArray(target) && !IsObject(target)) {
        return target; //Value copy
    }
    if (Array.isArray(target)) {
        return target.map(item => DeepCopy(item));
    }
    const copy = {};
    Object.entries(target).forEach(([key, value]) => (copy[key] = DeepCopy(value)));
    return copy;
}
