import { GetGlobalScope } from "../utilities/get-global-scope";
import { GlobalCreatedEvent } from "./key";
export function GetGlobal() {
    return (GetGlobalScope('global')['base'] || null);
}
export function WaitForGlobal() {
    return (GetGlobal() ? Promise.resolve() : new Promise(resolve => window.addEventListener(GlobalCreatedEvent, resolve)));
}
