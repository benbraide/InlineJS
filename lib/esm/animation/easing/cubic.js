import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";
export const CubicAnimationEase = CreateAnimationEaseCallback('cubic', ({ fraction }) => (1 - Math.pow((1 - fraction), 3)));
export function CubicAnimationEaseCompact() {
    AddAnimationEase(CubicAnimationEase);
}
export const CubicInAnimationEase = CreateAnimationEaseCallback('cubic.in', ({ fraction }) => Math.pow(fraction, 3));
export function CubicInAnimationEaseCompact() {
    AddAnimationEase(CubicInAnimationEase);
}
export const CubicOutAnimationEase = { name: `${CubicAnimationEase.name}.out`, callback: CubicAnimationEase.callback };
export function CubicOutAnimationEaseCompact() {
    AddAnimationEase(CubicOutAnimationEase);
}
export const CubicInOutAnimationEase = CreateAnimationEaseCallback('cubic.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (4 * Math.pow(fraction, 3)) : (1 - (Math.pow(((-2 * fraction) + 2), 3) / 2)));
});
export function CubicInOutAnimationEaseCompact() {
    AddAnimationEase(CubicInOutAnimationEase);
}
