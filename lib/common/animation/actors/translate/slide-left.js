"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideLeftAnimationActorCompact = exports.SlideLeftAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.SlideLeftAnimationActor = (0, generic_1.CreateTranslateAnimationActor)({ name: 'slide.left', axis: 'x' });
function SlideLeftAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.SlideLeftAnimationActor);
}
exports.SlideLeftAnimationActorCompact = SlideLeftAnimationActorCompact;
