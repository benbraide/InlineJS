"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDirectiveExpansionRule = void 0;
const get_1 = require("../global/get");
function OnDirectiveExpansionRule(name) {
    return (name.startsWith('@') ? name.replace('@', (0, get_1.GetGlobal)().GetConfig().GetDirectiveName('on:')) : null);
}
exports.OnDirectiveExpansionRule = OnDirectiveExpansionRule;
