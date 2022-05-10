import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const CircleAnimationEase = CreateAnimationEaseCallback('circle', ({ fraction }) => Math.sqrt(1 - Math.pow((fraction - 1), 2)));

export function CircleAnimationEaseCompact(){
    AddAnimationEase(CircleAnimationEase);
}

export const CircleInAnimationEase = CreateAnimationEaseCallback('circle.in', ({ fraction }) => (1 - Math.sqrt(1 - Math.pow(fraction, 2))));

export function CircleInAnimationEaseCompact(){
    AddAnimationEase(CircleInAnimationEase);
}

export const CircleOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${CircleAnimationEase.name}.out`, callback: CircleAnimationEase.callback };

export function CircleOutAnimationEaseCompact(){
    AddAnimationEase(CircleOutAnimationEase);
}

export const CircleInOutAnimationEase = CreateAnimationEaseCallback('circle', ({ fraction }) => {
    return (fraction < 0.5) ? ((1 - Math.sqrt(1 - Math.pow((2 * fraction), 2))) / 2) : ((Math.sqrt(1 - Math.pow(((-2 * fraction) + 2), 2)) + 1) / 2);
});

export function CircleInOutAnimationEaseCompact(){
    AddAnimationEase(CircleInOutAnimationEase);
}
