"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwingAnimationCreator = void 0;
const generic_1 = require("../actors/scene/generic");
function SwingAnimationCreator({ displacement = 5, unit = 'deg', origin: { x = 'start', y = 'start' } = {} } = {}) {
    return (0, generic_1.CreateSceneAnimationCallback)({
        origin: { x, y },
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, 0, 0, unit) },
            { checkpoint: 1, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, (displacement * 0), (displacement * 3), unit) },
            { checkpoint: 20, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, (displacement * 3), (displacement * -2), unit) },
            { checkpoint: 40, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, (displacement * -2), (displacement * 1), unit) },
            { checkpoint: 60, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, (displacement * 1), (displacement * -1), unit) },
            { checkpoint: 80, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, (displacement * -1), (displacement * 0), unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotate', fraction, 0, 0, unit) },
        ],
    });
}
exports.SwingAnimationCreator = SwingAnimationCreator;
