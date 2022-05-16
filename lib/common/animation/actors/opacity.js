"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpacityAnimationActorCompact = exports.OpacityAnimationActor = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.OpacityAnimationActor = (0, callback_1.CreateAnimationActorCallback)('opacity', ({ fraction, target, stage }) => {
    if (stage === 'end') {
        target.style.removeProperty('opacity');
    }
    else {
        target.style.opacity = fraction.toString();
    }
});
function OpacityAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.OpacityAnimationActor);
}
exports.OpacityAnimationActorCompact = OpacityAnimationActorCompact;
