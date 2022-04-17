import { GetTarget } from "./get-target";
import { ProxyKeys } from "./proxy-keys";

function IsObject_<T>(target: T){
    target = GetTarget(target);
    return (target && typeof target === 'object' && ((ProxyKeys.target in target) || ('__proto__' in target && target['__proto__'].constructor.name === 'Object')));
}

export function IsObject<T>(target: T){
    return !!IsObject_(target);
}

export function AreObjects<T>(targets: Array<T>){
    return (targets.findIndex(item => !IsObject_(item)) == -1);
}
