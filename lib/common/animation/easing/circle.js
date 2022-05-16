"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircleInOutAnimationEaseCompact = exports.CircleInOutAnimationEase = exports.CircleOutAnimationEaseCompact = exports.CircleOutAnimationEase = exports.CircleInAnimationEaseCompact = exports.CircleInAnimationEase = exports.CircleAnimationEaseCompact = exports.CircleAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.CircleAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('circle', ({ fraction }) => Math.sqrt(1 - Math.pow((fraction - 1), 2)));
function CircleAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CircleAnimationEase);
}
exports.CircleAnimationEaseCompact = CircleAnimationEaseCompact;
exports.CircleInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('circle.in', ({ fraction }) => (1 - Math.sqrt(1 - Math.pow(fraction, 2))));
function CircleInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CircleInAnimationEase);
}
exports.CircleInAnimationEaseCompact = CircleInAnimationEaseCompact;
exports.CircleOutAnimationEase = { name: `${exports.CircleAnimationEase.name}.out`, callback: exports.CircleAnimationEase.callback };
function CircleOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CircleOutAnimationEase);
}
exports.CircleOutAnimationEaseCompact = CircleOutAnimationEaseCompact;
exports.CircleInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('circle.in.out', ({ fraction }) => {
    return (fraction < 0.5) ? ((1 - Math.sqrt(1 - Math.pow((2 * fraction), 2))) / 2) : ((Math.sqrt(1 - Math.pow(((-2 * fraction) + 2), 2)) + 1) / 2);
});
function CircleInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.CircleInOutAnimationEase);
}
exports.CircleInOutAnimationEaseCompact = CircleInOutAnimationEaseCompact;
