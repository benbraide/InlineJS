"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideDownAnimationActorCompact = exports.SlideDownAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.SlideDownAnimationActor = (0, generic_1.CreateTranslateAnimationActor)({ name: 'slide.down', axis: 'y', factor: -generic_1.DefaultTranslateAnimationActorFactor });
function SlideDownAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.SlideDownAnimationActor);
}
exports.SlideDownAnimationActorCompact = SlideDownAnimationActorCompact;
