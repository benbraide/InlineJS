"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomAnimationActorCompact = exports.ZoomAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.ZoomAnimationActor = (0, generic_1.CreateScaleAnimationActor)({ name: 'zoom', axis: 'both', origin: { x: 'center', y: 'center' } });
function ZoomAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.ZoomAnimationActor);
}
exports.ZoomAnimationActorCompact = ZoomAnimationActorCompact;
