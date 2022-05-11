import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const QuadraticAnimationEase = CreateAnimationEaseCallback('quadratic', ({ fraction }) => (1 - Math.pow((1 - fraction), 2)));

export function QuadraticAnimationEaseCompact(){
    AddAnimationEase(QuadraticAnimationEase);
}

export const QuadraticInAnimationEase = CreateAnimationEaseCallback('quadratic.in', ({ fraction }) => Math.pow(fraction, 2));

export function QuadraticInAnimationEaseCompact(){
    AddAnimationEase(QuadraticInAnimationEase);
}

export const QuadraticOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${QuadraticAnimationEase.name}.out`, callback: QuadraticAnimationEase.callback };

export function QuadraticOutAnimationEaseCompact(){
    AddAnimationEase(QuadraticOutAnimationEase);
}

export const QuadraticInOutAnimationEase = CreateAnimationEaseCallback('quadratic.in.out', ({ fraction }) => {
    return ((fraction < 0.5) ? (2 * Math.pow(fraction, 2)) : (1 - (Math.pow(((-2 * fraction) + 2), 2) / 2)));
});

export function QuadraticInOutAnimationEaseCompact(){
    AddAnimationEase(QuadraticInOutAnimationEase);
}
