import { GetGlobal } from "../global/get";
import { GetTarget } from "./get-target";
export function ToString(target) {
    target = GetTarget(target);
    if (GetGlobal().IsFuture(target)) {
        return ToString(target.Get());
    }
    if ((!target && target !== false && target !== 0) || GetGlobal().IsNothing(target)) {
        return '';
    }
    if (typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string') {
        return target.toString();
    }
    return JSON.stringify(target);
}
