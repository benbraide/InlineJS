"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlipAnimationActorCompact = exports.FlipAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.FlipAnimationActor = (0, generic_1.CreateRotateAnimationActor)({ name: 'flip', axis: 'y' });
function FlipAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.FlipAnimationActor);
}
exports.FlipAnimationActorCompact = FlipAnimationActorCompact;
