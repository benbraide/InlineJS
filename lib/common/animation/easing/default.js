"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAnimationEaseCompact = exports.DefaultAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.DefaultAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('default', ({ fraction }) => ((fraction != 1) ? (-1 * Math.cos(fraction * (Math.PI / 2)) + 1) : 1));
function DefaultAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.DefaultAnimationEase);
}
exports.DefaultAnimationEaseCompact = DefaultAnimationEaseCompact;
