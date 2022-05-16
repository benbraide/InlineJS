"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TossAnimationActorCompact = exports.TossAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.TossAnimationActor = (0, generic_1.CreateRotateAnimationActor)({ name: 'toss', axis: 'x' });
function TossAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.TossAnimationActor);
}
exports.TossAnimationActorCompact = TossAnimationActorCompact;
