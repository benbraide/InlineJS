"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsEqual = void 0;
const get_target_1 = require("./get-target");
const is_object_1 = require("./is-object");
function IsEqual(first, second, useTargets = true) {
    let [firstTarget, secondTarget] = (useTargets ? (0, get_target_1.GetTargets)([first, second]) : [first, second]);
    if (firstTarget === secondTarget) {
        return true;
    }
    if (Array.isArray(firstTarget) && Array.isArray(secondTarget)) { //Compare items
        return (firstTarget.length == secondTarget.length && (firstTarget.findIndex((item, index) => !IsEqual(item, secondTarget[index], useTargets)) == -1));
    }
    if ((0, is_object_1.AreObjects)([firstTarget, secondTarget])) { //Compare keys and properties
        let firstKeys = Object.keys(firstTarget), secondKeys = Object.keys(secondTarget);
        return (firstKeys.length == secondKeys.length && (firstKeys.findIndex(key => (!secondKeys.includes(key) || !IsEqual(firstTarget[key], secondTarget[key], useTargets))) == -1));
    }
    return (firstTarget == secondTarget);
}
exports.IsEqual = IsEqual;
