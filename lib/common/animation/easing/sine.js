"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SineInOutAnimationEaseCompact = exports.SineInOutAnimationEase = exports.SineOutAnimationEaseCompact = exports.SineOutAnimationEase = exports.SineInAnimationEaseCompact = exports.SineInAnimationEase = exports.SineAnimationEaseCompact = exports.SineAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.SineAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('sine', ({ fraction }) => Math.sin((fraction * Math.PI) / 2));
function SineAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.SineAnimationEase);
}
exports.SineAnimationEaseCompact = SineAnimationEaseCompact;
exports.SineInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('sine.in', ({ fraction }) => (1 - Math.cos((fraction * Math.PI) / 2)));
function SineInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.SineInAnimationEase);
}
exports.SineInAnimationEaseCompact = SineInAnimationEaseCompact;
exports.SineOutAnimationEase = { name: `${exports.SineAnimationEase.name}.out`, callback: exports.SineAnimationEase.callback };
function SineOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.SineOutAnimationEase);
}
exports.SineOutAnimationEaseCompact = SineOutAnimationEaseCompact;
exports.SineInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('sine.in.out', ({ fraction }) => (-(Math.cos(Math.PI * fraction) - 1) / 2));
function SineInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.SineInOutAnimationEase);
}
exports.SineInOutAnimationEaseCompact = SineInOutAnimationEaseCompact;
