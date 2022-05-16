"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackInOutAnimationEaseCompact = exports.BackInOutAnimationEase = exports.BackOutAnimationEaseCompact = exports.BackOutAnimationEase = exports.BackInAnimationEaseCompact = exports.BackInAnimationEase = exports.BackAnimationEaseCompact = exports.BackAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.BackAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('back', ({ fraction }) => {
    fraction = (1 - fraction);
    return (1 - (fraction * fraction * ((2.70158 * fraction) - 1.70158)));
});
function BackAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BackAnimationEase);
}
exports.BackAnimationEaseCompact = BackAnimationEaseCompact;
exports.BackInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('back.in', ({ fraction }) => ((2.70158 * fraction * fraction * fraction) - (1.70158 * fraction * fraction)));
function BackInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BackInAnimationEase);
}
exports.BackInAnimationEaseCompact = BackInAnimationEaseCompact;
exports.BackOutAnimationEase = { name: `${exports.BackAnimationEase.name}.out`, callback: exports.BackAnimationEase.callback };
function BackOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BackOutAnimationEase);
}
exports.BackOutAnimationEaseCompact = BackOutAnimationEaseCompact;
exports.BackInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('back.in.out', ({ fraction }) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    if (fraction < 0.5) {
        return ((Math.pow(2 * fraction, 2) * ((c2 + 1) * 2 * fraction - c2)) / 2);
    }
    return ((Math.pow(2 * fraction - 2, 2) * ((c2 + 1) * (fraction * 2 - 2) + c2) + 2) / 2);
});
function BackInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BackInOutAnimationEase);
}
exports.BackInOutAnimationEaseCompact = BackInOutAnimationEaseCompact;
