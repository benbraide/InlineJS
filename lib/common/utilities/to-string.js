"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToString = void 0;
const get_1 = require("../global/get");
const get_target_1 = require("./get-target");
function ToString(target) {
    target = (0, get_target_1.GetTarget)(target);
    if ((0, get_1.GetGlobal)().IsFuture(target)) {
        return ToString(target.Get());
    }
    if ((!target && target !== false && target !== 0) || (0, get_1.GetGlobal)().IsNothing(target)) {
        return '';
    }
    if (typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string') {
        return target.toString();
    }
    return JSON.stringify(target);
}
exports.ToString = ToString;
