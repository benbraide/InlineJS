"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VibrateAnimationActorCompact = exports.VibrateAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.VibrateAnimationActor = (0, generic_1.CreateSceneAnimationActor)({
    name: 'vibrate',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, 0, 0, 'deg') },
        { checkpoint: 1, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, 0, 4, 'deg') },
        { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, -4, 4, 'deg') },
        { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, 4, -4, 'deg') },
        { checkpoint: 90, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, -4, 0, 'deg') },
        { checkpoint: 100, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'rotateZ', fraction, 0, 0, 'deg') },
    ],
});
function VibrateAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.VibrateAnimationActor);
}
exports.VibrateAnimationActorCompact = VibrateAnimationActorCompact;
