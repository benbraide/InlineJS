"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToCamelCase = void 0;
function ToCamelCase(value, ucfirst, separator) {
    let [first = '', ...rest] = value.trim().split(separator || '-'), capitalize = (word) => (word.charAt(0).toUpperCase() + word.substring(1));
    return (first && ((ucfirst ? capitalize(first) : first) + (rest || []).map(word => capitalize(word)).join('')));
}
exports.ToCamelCase = ToCamelCase;
