import { IGlobal } from "../types/global";
import { GetGlobalScope } from "../utilities/get-global-scope";
import { GlobalCreatedEvent } from "./key";

export function GetGlobal(): IGlobal{
    return (GetGlobalScope('global')['base'] || null);
}

export function WaitForGlobal(){
    return (GetGlobal() ? Promise.resolve() : new Promise(resolve => window.addEventListener(GlobalCreatedEvent, resolve)));
}
