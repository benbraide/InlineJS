import { GetTarget } from "./get-target";
export function SupportsAttributes(target) {
    target = GetTarget(target);
    return (target && 'getAttribute' in target && 'setAttribute' in target);
}
