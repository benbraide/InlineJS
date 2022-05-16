"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubberbandAnimationCreator = void 0;
const generic_1 = require("../actors/scene/generic");
function RubberbandAnimationCreator({ factor = 1.26, multiplier = 0.10 } = {}) {
    return (0, generic_1.CreateSceneAnimationCallback)({
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, null, 1, null, 1) },
            { checkpoint: 1, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, -2, 0, -2, 5) },
            { checkpoint: 30, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, 0, 5, 5, 0) },
            { checkpoint: 40, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, 5, 1, 0, 4) },
            { checkpoint: 50, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, 1, 3, 4, 2) },
            { checkpoint: 65, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, 3, 2, 2, 3) },
            { checkpoint: 75, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, 2, -2, 3, -2) },
            { checkpoint: 100, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, multiplier, null, 1, null, 1) },
        ],
    });
}
exports.RubberbandAnimationCreator = RubberbandAnimationCreator;
function ComputeAndApply(target, fraction, factor, multiplier, fromX, toX, fromY, toY) {
    let xValue = ((fromX === null) ? toX : (0, generic_1.ApplyRange)(fraction, SubtractFactor(factor, multiplier, fromX), SubtractFactor(factor, multiplier, toX)));
    let yValue = ((fromY === null) ? toY : (0, generic_1.ApplyRange)(fraction, SubtractFactor(factor, multiplier, fromY), SubtractFactor(factor, multiplier, toY)));
    (0, generic_1.ApplyTransform)(target, 'scale', `${xValue},${yValue}`);
}
function SubtractFactor(factor, multiplier, value) {
    return ((0 <= value) ? (factor - (multiplier * value)) : -(value + 1));
}
