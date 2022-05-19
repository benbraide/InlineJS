import { GetGlobal } from "../global/get";

export function OnDirectiveExpansionRule(name: string){
    return (name.startsWith('@') ? name.replace('@', GetGlobal().GetConfig().GetDirectiveName('on:')) : null);
}
