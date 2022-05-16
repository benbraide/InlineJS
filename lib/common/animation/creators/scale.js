"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScaleAnimationCreator = void 0;
const generic_1 = require("../actors/scale/generic");
function ScaleAnimationCreator(params = {}) {
    return (0, generic_1.CreateScaleAnimationCallback)(params);
}
exports.ScaleAnimationCreator = ScaleAnimationCreator;
