"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuartInOutAnimationEaseCompact = exports.QuartInOutAnimationEase = exports.QuartOutAnimationEaseCompact = exports.QuartOutAnimationEase = exports.QuartInAnimationEaseCompact = exports.QuartInAnimationEase = exports.QuartAnimationEaseCompact = exports.QuartAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.QuartAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quart', ({ fraction }) => (1 - Math.pow((1 - fraction), 4)));
function QuartAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuartAnimationEase);
}
exports.QuartAnimationEaseCompact = QuartAnimationEaseCompact;
exports.QuartInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quart.in', ({ fraction }) => Math.pow((1 - fraction), 4));
function QuartInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuartInAnimationEase);
}
exports.QuartInAnimationEaseCompact = QuartInAnimationEaseCompact;
exports.QuartOutAnimationEase = { name: `${exports.QuartAnimationEase.name}.out`, callback: exports.QuartAnimationEase.callback };
function QuartOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuartOutAnimationEase);
}
exports.QuartOutAnimationEaseCompact = QuartOutAnimationEaseCompact;
exports.QuartInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('quart.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (8 * Math.pow(fraction, 4)) : (1 - (Math.pow(((-2 * fraction) + 2), 4) / 2)));
});
function QuartInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.QuartInOutAnimationEase);
}
exports.QuartInOutAnimationEaseCompact = QuartInOutAnimationEaseCompact;
