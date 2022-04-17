import { GetTarget } from "./get-target";

export function SupportsAttributes(target: any){
    target = GetTarget(target);
    return (target && 'getAttribute' in target && 'setAttribute' in target);
}
