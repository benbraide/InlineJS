"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JelloAnimationCreator = void 0;
const generic_1 = require("../actors/scene/generic");
function JelloAnimationCreator({ factor = 12.6, divisor = 2, unit = 'deg' } = {}) {
    return (0, generic_1.CreateSceneAnimationCallback)({
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 0, unit) },
            { checkpoint: 11.1, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 1, unit) },
            { checkpoint: 22.2, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 2, unit) },
            { checkpoint: 33.3, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 3, unit) },
            { checkpoint: 44.4, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 4, unit) },
            { checkpoint: 55.5, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 5, unit) },
            { checkpoint: 66.6, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 6, unit) },
            { checkpoint: 77.7, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 7, unit) },
            { checkpoint: 88.8, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 8, unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => ComputeAndApply(target, fraction, factor, divisor, 0, unit) },
        ],
    });
}
exports.JelloAnimationCreator = JelloAnimationCreator;
function ComputeAndApply(target, fraction, factor, divisor, value, unit) {
    let [from, to] = ApplyFactorAndDivisor(factor, divisor, value);
    (0, generic_1.ApplyRangeAndTransform)(target, 'skew', fraction, from, to, unit, 2);
}
function ApplyFactorAndDivisor(factor, divisor, value) {
    let from = ((value < 2) ? 0 : (factor / Math.pow(divisor, (value - 1)))), to = ((value < 1) ? 0 : (factor / Math.pow(divisor, value)));
    if ((value % 2) == 0) {
        from = -from;
    }
    else {
        to = -to;
    }
    return [from, to];
}
