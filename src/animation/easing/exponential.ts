import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const ExponentialAnimationEase = CreateAnimationEaseCallback('exponential', ({ fraction }) => ((fraction == 1) ? fraction : (1 - Math.pow(2, (-10 * fraction)))));

export function ExponentialAnimationEaseCompact(){
    AddAnimationEase(ExponentialAnimationEase);
}

export const ExponentialInAnimationEase = CreateAnimationEaseCallback('exponential.in', ({ fraction }) => ((fraction == 0) ? 0 : Math.pow(2, ((10 * fraction) - 10))));

export function ExponentialInAnimationEaseCompact(){
    AddAnimationEase(ExponentialInAnimationEase);
}

export const ExponentialOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${ExponentialAnimationEase.name}.out`, callback: ExponentialAnimationEase.callback };

export function ExponentialOutAnimationEaseCompact(){
    AddAnimationEase(ExponentialOutAnimationEase);
}

export const ExponentialInOutAnimationEase = CreateAnimationEaseCallback('exponential.in.out', ({ fraction }) => ((fraction == 1) ? fraction : (1 - Math.pow(2, (-10 * fraction)))));

export function ExponentialInOutAnimationEaseCompact(){
    AddAnimationEase(ExponentialInOutAnimationEase);
}
