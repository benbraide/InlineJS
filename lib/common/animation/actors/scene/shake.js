"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShakeAnimationActorCompact = exports.ShakeAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.ShakeAnimationActor = (0, generic_1.CreateSceneAnimationActor)({
    name: 'shake',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, 0, 'px') },
        { checkpoint: 1, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, 10, 'px') },
        { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, -10, 10, 'px') },
        { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 10, -10, 'px') },
        { checkpoint: 90, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, -10, 0, 'px') },
        { checkpoint: 100, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'translateX', fraction, 0, 0, 'px') },
    ],
});
function ShakeAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.ShakeAnimationActor);
}
exports.ShakeAnimationActorCompact = ShakeAnimationActorCompact;
