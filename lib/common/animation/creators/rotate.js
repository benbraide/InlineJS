"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotateAnimationCreator = void 0;
const generic_1 = require("../actors/rotate/generic");
function RotateAnimationCreator(params = {}) {
    return (0, generic_1.CreateRotateAnimationCallback)(params);
}
exports.RotateAnimationCreator = RotateAnimationCreator;
