"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullAnimationActorCompact = exports.NullAnimationActor = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.NullAnimationActor = (0, callback_1.CreateAnimationActorCallback)('null', () => { });
function NullAnimationActorCompact() {
    (0, add_1.AddAnimationActor)(exports.NullAnimationActor);
}
exports.NullAnimationActorCompact = NullAnimationActorCompact;
