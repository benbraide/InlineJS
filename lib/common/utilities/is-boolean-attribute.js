"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBooleanAttribute = void 0;
const get_1 = require("../global/get");
function IsBooleanAttribute(element, name) {
    if (element.hasOwnProperty('IsBooleanAttribute') && typeof element['IsBooleanAttribute'] === 'function') {
        const response = element['IsBooleanAttribute'](name);
        if (response === false || response === true) {
            return response;
        }
    }
    return (0, get_1.GetGlobal)().GetConfig().IsBooleanAttribute(name);
}
exports.IsBooleanAttribute = IsBooleanAttribute;
