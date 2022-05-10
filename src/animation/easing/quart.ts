import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const QuartAnimationEase = CreateAnimationEaseCallback('quart', ({ fraction }) => (1 - Math.pow((1 - fraction), 4)));

export function QuartAnimationEaseCompact(){
    AddAnimationEase(QuartAnimationEase);
}

export const QuartInAnimationEase = CreateAnimationEaseCallback('quart.in', ({ fraction }) => Math.pow((1 - fraction), 4));

export function QuartInAnimationEaseCompact(){
    AddAnimationEase(QuartInAnimationEase);
}

export const QuartOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${QuartAnimationEase.name}.out`, callback: QuartAnimationEase.callback };

export function QuartOutAnimationEaseCompact(){
    AddAnimationEase(QuartOutAnimationEase);
}

export const QuartInOutAnimationEase = CreateAnimationEaseCallback('quart', ({ fraction }) => {
    return ((fraction < 0.5) ? (8 * Math.pow(fraction, 4)) : (1 - (Math.pow(((-2 * fraction) + 2), 4) / 2)));
});

export function QuartInOutAnimationEaseCompact(){
    AddAnimationEase(QuartInOutAnimationEase);
}
