"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidthAnimationActorCompact = exports.WidthAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.WidthAnimationActor = (0, generic_1.CreateScaleAnimationActor)({ name: 'width', axis: 'x', origin: { x: 'start', y: 'center' } });
function WidthAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.WidthAnimationActor);
}
exports.WidthAnimationActorCompact = WidthAnimationActorCompact;
