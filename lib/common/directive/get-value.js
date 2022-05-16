"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDirectiveValue = void 0;
const get_1 = require("../global/get");
function GetDirectiveValue(element, value, short) {
    let name = (0, get_1.GetGlobal)().GetConfig().GetDirectiveName(value, false), fname = (0, get_1.GetGlobal)().GetConfig().GetDirectiveName(value, true);
    return ((element.getAttribute(name) || element.getAttribute(fname) || (short && element.getAttribute(short))) || null);
}
exports.GetDirectiveValue = GetDirectiveValue;
