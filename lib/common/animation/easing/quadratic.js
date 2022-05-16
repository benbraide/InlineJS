"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadraticInOutAnimationEaseCompact = exports.QuadraticInOutAnimationEase = exports.QuadraticOutAnimationEaseCompact = exports.QuadraticOutAnimationEase = exports.QuadraticInAnimationEaseCompact = exports.QuadraticInAnimationEase = exports.QuadraticAnimationEaseCompact = exports.QuadraticAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.QuadraticAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quadratic', ({ fraction }) => (1 - Math.pow((1 - fraction), 2)));
function QuadraticAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuadraticAnimationEase);
}
exports.QuadraticAnimationEaseCompact = QuadraticAnimationEaseCompact;
exports.QuadraticInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quadratic.in', ({ fraction }) => Math.pow(fraction, 2));
function QuadraticInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuadraticInAnimationEase);
}
exports.QuadraticInAnimationEaseCompact = QuadraticInAnimationEaseCompact;
exports.QuadraticOutAnimationEase = { name: `${exports.QuadraticAnimationEase.name}.out`, callback: exports.QuadraticAnimationEase.callback };
function QuadraticOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuadraticOutAnimationEase);
}
exports.QuadraticOutAnimationEaseCompact = QuadraticOutAnimationEaseCompact;
exports.QuadraticInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quadratic.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (2 * Math.pow(fraction, 2)) : (1 - (Math.pow(((-2 * fraction) + 2), 2) / 2)));
});
function QuadraticInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuadraticInOutAnimationEase);
}
exports.QuadraticInOutAnimationEaseCompact = QuadraticInOutAnimationEaseCompact;
