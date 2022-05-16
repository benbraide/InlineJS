"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExponentialInOutAnimationEaseCompact = exports.ExponentialInOutAnimationEase = exports.ExponentialOutAnimationEaseCompact = exports.ExponentialOutAnimationEase = exports.ExponentialInAnimationEaseCompact = exports.ExponentialInAnimationEase = exports.ExponentialAnimationEaseCompact = exports.ExponentialAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.ExponentialAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('exponential', ({ fraction }) => ((fraction == 1) ? fraction : (1 - Math.pow(2, (-10 * fraction)))));
function ExponentialAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ExponentialAnimationEase);
}
exports.ExponentialAnimationEaseCompact = ExponentialAnimationEaseCompact;
exports.ExponentialInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('exponential.in', ({ fraction }) => ((fraction == 0) ? 0 : Math.pow(2, ((10 * fraction) - 10))));
function ExponentialInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ExponentialInAnimationEase);
}
exports.ExponentialInAnimationEaseCompact = ExponentialInAnimationEaseCompact;
exports.ExponentialOutAnimationEase = { name: `${exports.ExponentialAnimationEase.name}.out`, callback: exports.ExponentialAnimationEase.callback };
function ExponentialOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ExponentialOutAnimationEase);
}
exports.ExponentialOutAnimationEaseCompact = ExponentialOutAnimationEaseCompact;
exports.ExponentialInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('exponential.in.out', ({ fraction }) => ((fraction == 1) ? fraction : (1 - Math.pow(2, (-10 * fraction)))));
function ExponentialInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.ExponentialInOutAnimationEase);
}
exports.ExponentialInOutAnimationEaseCompact = ExponentialInOutAnimationEaseCompact;
