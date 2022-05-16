"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeightAnimationActorCompact = exports.HeightAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.HeightAnimationActor = (0, generic_1.CreateScaleAnimationActor)({ name: 'height', axis: 'y', origin: { x: 'center', y: 'start' } });
function HeightAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.HeightAnimationActor);
}
exports.HeightAnimationActorCompact = HeightAnimationActorCompact;
