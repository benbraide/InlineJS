"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubicInOutAnimationEaseCompact = exports.CubicInOutAnimationEase = exports.CubicOutAnimationEaseCompact = exports.CubicOutAnimationEase = exports.CubicInAnimationEaseCompact = exports.CubicInAnimationEase = exports.CubicAnimationEaseCompact = exports.CubicAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.CubicAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('cubic', ({ fraction }) => (1 - Math.pow((1 - fraction), 3)));
function CubicAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CubicAnimationEase);
}
exports.CubicAnimationEaseCompact = CubicAnimationEaseCompact;
exports.CubicInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('cubic.in', ({ fraction }) => Math.pow(fraction, 3));
function CubicInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CubicInAnimationEase);
}
exports.CubicInAnimationEaseCompact = CubicInAnimationEaseCompact;
exports.CubicOutAnimationEase = { name: `${exports.CubicAnimationEase.name}.out`, callback: exports.CubicAnimationEase.callback };
function CubicOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CubicOutAnimationEase);
}
exports.CubicOutAnimationEaseCompact = CubicOutAnimationEaseCompact;
exports.CubicInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('cubic.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (4 * Math.pow(fraction, 3)) : (1 - (Math.pow(((-2 * fraction) + 2), 3) / 2)));
});
function CubicInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CubicInOutAnimationEase);
}
exports.CubicInOutAnimationEaseCompact = CubicInOutAnimationEaseCompact;
