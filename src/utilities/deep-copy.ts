import { GetTarget } from "./get-target";
import { IsObject } from "./is-object";

export function DeepCopy<T>(target: T){
    target = GetTarget(target);
    if (!Array.isArray(target) && !IsObject(target)){
        return target;//Value copy
    }

    if (Array.isArray(target)){
        return target.map(item => DeepCopy(item));
    }

    let copy: Record<string, any> = {};
    Object.entries(<Record<string, any>>target).forEach(([key, value]) => (copy[key] = DeepCopy(value)));

    return copy;
}
