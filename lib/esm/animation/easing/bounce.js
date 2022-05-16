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
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";
export const BounceAnimationEase = CreateAnimationEaseCallback('bounce', ({ fraction }) => {
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
export function BounceAnimationEaseCompact() {
    AddAnimationEase(BounceAnimationEase);
}
export const BounceInAnimationEase = CreateAnimationEaseCallback('bounce.in', (_a) => {
    var { fraction } = _a, rest = __rest(_a, ["fraction"]);
    return (1 - BounceAnimationEase.callback(Object.assign({ fraction: (1 - fraction) }, rest)));
});
export function BounceInAnimationEaseCompact() {
    AddAnimationEase(BounceInAnimationEase);
}
export const BounceOutAnimationEase = { name: `${BounceAnimationEase.name}.out`, callback: BounceAnimationEase.callback };
export function BounceOutAnimationEaseCompact() {
    AddAnimationEase(BounceOutAnimationEase);
}
export const BounceInOutAnimationEase = CreateAnimationEaseCallback('bounce.in.out', (_a) => {
    var { fraction } = _a, rest = __rest(_a, ["fraction"]);
    if (fraction < 0.5) {
        return ((1 - BounceInAnimationEase.callback(Object.assign({ fraction: (1 - (2 * fraction)) }, rest))) / 2);
    }
    return ((1 + BounceAnimationEase.callback(Object.assign({ fraction: ((2 * fraction) - 1) }, rest))) / 2);
});
export function BounceInOutAnimationEaseCompact() {
    AddAnimationEase(BounceInOutAnimationEase);
}
