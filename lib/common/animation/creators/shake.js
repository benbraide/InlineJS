"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShakeAnimationCreator = void 0;
const generic_1 = require("../actors/scene/generic");
function ShakeAnimationCreator({ displacement = 10, unit = 'px' } = {}) {
    return (0, generic_1.CreateSceneAnimationCallback)({
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, 0, unit) },
            { checkpoint: 1, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, displacement, unit) },
            { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, -displacement, displacement, unit) },
            { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, displacement, -displacement, unit) },
            { checkpoint: 90, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, -displacement, 0, unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, 0, unit) },
        ],
    });
}
exports.ShakeAnimationCreator = ShakeAnimationCreator;
