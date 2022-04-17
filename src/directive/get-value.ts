import { GetGlobal } from "../global/get";

export function GetDirectiveValue(element: HTMLElement, value: string, short?: string){
    let name = GetGlobal().GetConfig().GetDirectiveName(value, false), fname = GetGlobal().GetConfig().GetDirectiveName(value, true);
    return ((element.getAttribute(name) || element.getAttribute(fname) || (short && element.getAttribute(short))) || null);
}
