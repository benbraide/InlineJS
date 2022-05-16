import { GetGlobal } from "../global/get";
export function CreateDirectiveExpansionRule(rule, expandWith) {
    return (name) => ((name.search(rule) == -1) ? null : name.replace(rule, expandWith));
}
export function AddDirectiveExpansionRule(rule) {
    return GetGlobal().GetDirectiveManager().AddExpansionRule(rule);
}
export function RemoveDirectiveExpansionRule(id) {
    GetGlobal().GetDirectiveManager().RemoveExpansionRule(id);
}
export function ApplyDirectiveExpansionRules(name) {
    return GetGlobal().GetDirectiveManager().Expand(name);
}
