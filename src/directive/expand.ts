import { GetGlobal } from "../global/get";
import { DirectiveExpansionRuleType } from "../types/directives";

export function CreateDirectiveExpansionRule(rule: RegExp | string, expandWith: string): DirectiveExpansionRuleType{
    return (name) => ((name.search(rule) == -1) ? null : name.replace(rule, expandWith));
}

export function AddDirectiveExpansionRule(rule: DirectiveExpansionRuleType){
    return GetGlobal().GetDirectiveManager().AddExpansionRule(rule);
}

export function RemoveDirectiveExpansionRule(id: string){
    GetGlobal().GetDirectiveManager().RemoveExpansionRule(id);
}

export function ApplyDirectiveExpansionRules(name: string){
    return GetGlobal().GetDirectiveManager().Expand(name);
}
