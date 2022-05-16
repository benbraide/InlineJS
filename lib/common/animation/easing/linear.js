"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearAnimationEaseCompact = exports.LinearAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.LinearAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('linear', ({ fraction }) => fraction);
function LinearAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.LinearAnimationEase);
}
exports.LinearAnimationEaseCompact = LinearAnimationEaseCompact;
