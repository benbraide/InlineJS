"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAnimationActorCompact = exports.DefaultAnimationActor = void 0;
const add_1 = require("./add");
const opacity_1 = require("./opacity");
exports.DefaultAnimationActor = { name: 'default', callback: opacity_1.OpacityAnimationActor.callback };
function DefaultAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.DefaultAnimationActor);
}
exports.DefaultAnimationActorCompact = DefaultAnimationActorCompact;
