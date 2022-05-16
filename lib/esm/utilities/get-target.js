import { ProxyKeys } from "./proxy-keys";
export function GetTarget(target) {
    return (((Array.isArray(target) || (target && typeof target === 'object')) && ProxyKeys.target in target) ? GetTarget(target[ProxyKeys.target]) : target);
}
export function GetTargets(targets) {
    return targets.map(target => GetTarget(target));
}
