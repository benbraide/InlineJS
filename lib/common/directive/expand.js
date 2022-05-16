"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyDirectiveExpansionRules = exports.RemoveDirectiveExpansionRule = exports.AddDirectiveExpansionRule = exports.CreateDirectiveExpansionRule = void 0;
const get_1 = require("../global/get");
function CreateDirectiveExpansionRule(rule, expandWith) {
    return (name) => ((name.search(rule) == -1) ? null : name.replace(rule, expandWith));
}
exports.CreateDirectiveExpansionRule = CreateDirectiveExpansionRule;
function AddDirectiveExpansionRule(rule) {
    return (0, get_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(rule);
}
exports.AddDirectiveExpansionRule = AddDirectiveExpansionRule;
function RemoveDirectiveExpansionRule(id) {
    (0, get_1.GetGlobal)().GetDirectiveManager().RemoveExpansionRule(id);
}
exports.RemoveDirectiveExpansionRule = RemoveDirectiveExpansionRule;
function ApplyDirectiveExpansionRules(name) {
    return (0, get_1.GetGlobal)().GetDirectiveManager().Expand(name);
}
exports.ApplyDirectiveExpansionRules = ApplyDirectiveExpansionRules;
