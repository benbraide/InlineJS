"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDirectiveExpansionRule = void 0;
const get_1 = require("../global/get");
function ClassDirectiveExpansionRule(name) {
    return (name.startsWith('.') ? name.replace('.', (0, get_1.GetGlobal)().GetConfig().GetDirectiveName('class:')) : null);
}
exports.ClassDirectiveExpansionRule = ClassDirectiveExpansionRule;
