"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToSnakeCase = void 0;
function ToSnakeCase(value, separator = '-') {
    separator = (separator || '-');
    let converted = value.replace(/([A-Z]+)/g, (match) => `${separator}${match.toLowerCase()}`);
    return (converted.startsWith(separator) ? converted.substring(1) : converted);
}
exports.ToSnakeCase = ToSnakeCase;
