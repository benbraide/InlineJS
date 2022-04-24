import { IGlobal } from "../types/global";
import { InlineJSGlobalKey } from "./create";

export const GlobalCreatedEvent = 'inlinejs.global.created';

export function GetGlobal(): IGlobal{
    return globalThis[InlineJSGlobalKey];
}

export function WaitForGlobal(){
    return (GetGlobal() ? Promise.resolve() : new Promise(resolve => window.addEventListener(GlobalCreatedEvent, resolve)));
}
