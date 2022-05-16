"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BounceInOutAnimationEaseCompact = exports.BounceInOutAnimationEase = exports.BounceOutAnimationEaseCompact = exports.BounceOutAnimationEase = exports.BounceInAnimationEaseCompact = exports.BounceInAnimationEase = exports.BounceAnimationEaseCompact = exports.BounceAnimationEase = void 0;
const add_1 = require("./add");
const callback_1 = require("./callback");
exports.BounceAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('bounce', ({ fraction }) => {
    if (fraction < (1 / 2.75)) {
        return (7.5625 * fraction * fraction);
    }
    if (fraction < (2 / 2.75)) {
        fraction -= (1.5 / 2.75);
        return ((7.5625 * fraction * fraction) + 0.75);
    }
    if (fraction < (2.5 / 2.75)) {
        fraction -= (2.25 / 2.75);
        return ((7.5625 * fraction * fraction) + 0.9375);
    }
    fraction -= (2.625 / 2.75);
    return ((7.5625 * fraction * fraction) + 0.984375);
});
function BounceAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BounceAnimationEase);
}
exports.BounceAnimationEaseCompact = BounceAnimationEaseCompact;
exports.BounceInAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('bounce.in', (_a) => {
    var { fraction } = _a, rest = __rest(_a, ["fraction"]);
    return (1 - exports.BounceAnimationEase.callback(Object.assign({ fraction: (1 - fraction) }, rest)));
});
function BounceInAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BounceInAnimationEase);
}
exports.BounceInAnimationEaseCompact = BounceInAnimationEaseCompact;
exports.BounceOutAnimationEase = { name: `${exports.BounceAnimationEase.name}.out`, callback: exports.BounceAnimationEase.callback };
function BounceOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BounceOutAnimationEase);
}
exports.BounceOutAnimationEaseCompact = BounceOutAnimationEaseCompact;
exports.BounceInOutAnimationEase = (0, callback_1.CreateAnimationEaseCallback)('bounce.in.out', (_a) => {
    var { fraction } = _a, rest = __rest(_a, ["fraction"]);
    if (fraction < 0.5) {
        return ((1 - exports.BounceInAnimationEase.callback(Object.assign({ fraction: (1 - (2 * fraction)) }, rest))) / 2);
    }
    return ((1 + exports.BounceAnimationEase.callback(Object.assign({ fraction: ((2 * fraction) - 1) }, rest))) / 2);
});
function BounceInOutAnimationEaseCompact() {
    (0, add_1.AddAnimationEase)(exports.BounceInOutAnimationEase);
}
exports.BounceInOutAnimationEaseCompact = BounceInOutAnimationEaseCompact;
