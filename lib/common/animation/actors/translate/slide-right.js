"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideRightAnimationActorCompact = exports.SlideRightAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.SlideRightAnimationActor = (0, generic_1.CreateTranslateAnimationActor)({ name: 'slide.right', axis: 'x', factor: -generic_1.DefaultTranslateAnimationActorFactor });
function SlideRightAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.SlideRightAnimationActor);
}
exports.SlideRightAnimationActorCompact = SlideRightAnimationActorCompact;
