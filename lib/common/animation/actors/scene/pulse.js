"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulseAnimationActorCompact = exports.PulseAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.PulseAnimationActor = (0, generic_1.CreateSceneAnimationActor)({
    name: 'pulse',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1, '', 2) },
        { checkpoint: 1, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1.26, '', 2) },
        { checkpoint: 50, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1.26, 1, '', 2) },
        { checkpoint: 100, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1, '', 2) },
    ],
});
function PulseAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.PulseAnimationActor);
}
exports.PulseAnimationActorCompact = PulseAnimationActorCompact;
