"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinAnimationActorCompact = exports.SpinAnimationActor = void 0;
const add_1 = require("../add");
const generic_1 = require("./generic");
exports.SpinAnimationActor = (0, generic_1.CreateRotateAnimationActor)({ name: 'spin', axis: 'z' });
function SpinAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.SpinAnimationActor);
}
exports.SpinAnimationActorCompact = SpinAnimationActorCompact;
