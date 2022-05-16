"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuintInOutAnimationEaseCompact = exports.QuintInOutAnimationEase = exports.QuintOutAnimationEaseCompact = exports.QuintOutAnimationEase = exports.QuintInAnimationEaseCompact = exports.QuintInAnimationEase = exports.QuintAnimationEaseCompact = exports.QuintAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.QuintAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quint', ({ fraction }) => (1 - Math.pow((1 - fraction), 5)));
function QuintAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuintAnimationEase);
}
exports.QuintAnimationEaseCompact = QuintAnimationEaseCompact;
exports.QuintInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quint.in', ({ fraction }) => Math.pow((1 - fraction), 5));
function QuintInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuintInAnimationEase);
}
exports.QuintInAnimationEaseCompact = QuintInAnimationEaseCompact;
exports.QuintOutAnimationEase = { name: `${exports.QuintAnimationEase.name}.out`, callback: exports.QuintAnimationEase.callback };
function QuintOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuintOutAnimationEase);
}
exports.QuintOutAnimationEaseCompact = QuintOutAnimationEaseCompact;
exports.QuintInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quint.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (16 * Math.pow(fraction, 5)) : (1 - (Math.pow(((-2 * fraction) + 2), 5) / 2)));
});
function QuintInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuintInOutAnimationEase);
}
exports.QuintInOutAnimationEaseCompact = QuintInOutAnimationEaseCompact;
