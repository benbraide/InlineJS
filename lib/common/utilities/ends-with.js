"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndsWith = void 0;
function EndsWith(match, ignoreCase = false) {
    return (new RegExp(`${match}$`, (ignoreCase ? 'i' : undefined)));
}
exports.EndsWith = EndsWith;
