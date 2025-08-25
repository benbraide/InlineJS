"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportsAttributes = void 0;
const get_target_1 = require("./get-target");
function SupportsAttributes(target) {
    target = (0, get_target_1.GetTarget)(target);
    return (target && typeof target === 'object' && 'hasAttribute' in target && 'getAttribute' in target && 'setAttribute' in target && 'removeAttribute' in target);
}
exports.SupportsAttributes = SupportsAttributes;
