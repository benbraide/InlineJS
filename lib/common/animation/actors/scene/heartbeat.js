"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartbeatAnimationActorCompact = exports.HeartbeatAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.HeartbeatAnimationActor = (0, generic_1.CreateSceneAnimationActor)({
    name: 'heartbeat',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1, '', 2) },
        { checkpoint: [1, 28], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1.26, '', 2) },
        { checkpoint: [14, 42], actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1.26, 1, '', 2) },
        { checkpoint: 70, actor: ({ target, fraction }) => (0, generic_1.ApplyRangeAndTransform)(target, 'scale', fraction, 1, 1, '', 2) },
    ],
});
function HeartbeatAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.HeartbeatAnimationActor);
}
exports.HeartbeatAnimationActorCompact = HeartbeatAnimationActorCompact;
