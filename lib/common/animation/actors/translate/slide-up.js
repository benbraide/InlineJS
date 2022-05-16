"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideUpAnimationActorCompact = exports.SlideUpAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.SlideUpAnimationActor = (0, generic_1.CreateTranslateAnimationActor)({ name: 'slide.up', axis: 'y' });
function SlideUpAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.SlideUpAnimationActor);
}
exports.SlideUpAnimationActorCompact = SlideUpAnimationActorCompact;
