import { GetTarget } from "./get-target";
import { ProxyKeys } from "./proxy-keys";
function IsObject_(target) {
    target = GetTarget(target);
    return (target && typeof target === 'object' && ((ProxyKeys.target in target) || ('__proto__' in target && target['__proto__'].constructor.name === 'Object')));
}
export function IsObject(target) {
    return !!IsObject_(target);
}
export function AreObjects(targets) {
    return (targets.findIndex(item => !IsObject_(item)) == -1);
}
