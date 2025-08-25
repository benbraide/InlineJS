import { GetTarget } from "./get-target";
export function SupportsAttributes(target) {
    target = GetTarget(target);
    return (target && typeof target === 'object' && 'hasAttribute' in target && 'getAttribute' in target && 'setAttribute' in target && 'removeAttribute' in target);
}
