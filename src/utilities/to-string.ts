import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { GetTarget } from "./get-target";
import { IsObject } from "./is-object";

export function ToString(target: any){
    target = GetTarget(target);
    if (target instanceof Future){
        return ToString(target.Get());
    }
    
    if ((!target && target !== false && target !== 0) || (target instanceof Nothing)){
        return '';
    }

    if (typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string'){
        return target.toString();
    }

    return JSON.stringify(target);
}
