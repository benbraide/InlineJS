import { GetTarget } from "./get-target";
import { IsObject } from "./is-object";

export function ToString(target: any){
    target = GetTarget(target);
    if (!target && target !== false && target !== 0){
        return '';
    }

    if (typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string'){
        return target.toString();
    }

    return JSON.stringify(target);
}
