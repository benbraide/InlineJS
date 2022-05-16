"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeginsWith = void 0;
function BeginsWith(match, ignoreCase = false) {
    return (new RegExp(`^${match}`, (ignoreCase ? 'i' : undefined)));
}
exports.BeginsWith = BeginsWith;
