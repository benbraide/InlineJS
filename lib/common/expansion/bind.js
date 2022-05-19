"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindDirectiveExpansionRule = void 0;
const get_1 = require("../global/get");
function BindDirectiveExpansionRule(name) {
    return (name.startsWith(':') ? ((0, get_1.GetGlobal)().GetConfig().GetDirectiveName('bind') + name) : null);
}
exports.BindDirectiveExpansionRule = BindDirectiveExpansionRule;
