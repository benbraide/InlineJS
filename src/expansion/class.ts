import { GetGlobal } from "../global/get";

export function ClassDirectiveExpansionRule(name: string){
    return (name.startsWith('.') ? name.replace('.', GetGlobal().GetConfig().GetDirectiveName('class:')) : null);
}
