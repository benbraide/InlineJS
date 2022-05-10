import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const BackAnimationEase = CreateAnimationEaseCallback('back', ({ fraction }) => {
    fraction = (1 - fraction);
    return (1 - (fraction * fraction * ((2.70158 * fraction) - 1.70158)));
});

export function BackAnimationEaseCompact(){
    AddAnimationEase(BackAnimationEase);
}

export const BackInAnimationEase = CreateAnimationEaseCallback('back.in', ({ fraction }) => ((2.70158 * fraction * fraction * fraction) - (1.70158 * fraction * fraction)));

export function BackInAnimationEaseCompact(){
    AddAnimationEase(BackInAnimationEase);
}

export const BackOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${BackAnimationEase.name}.out`, callback: BackAnimationEase.callback };

export function BackOutAnimationEaseCompact(){
    AddAnimationEase(BackOutAnimationEase);
}

export const BackInOutAnimationEase = CreateAnimationEaseCallback('back', ({ fraction }) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    if (fraction < 0.5){
        return ((Math.pow(2 * fraction, 2) * ((c2 + 1) * 2 * fraction - c2)) / 2);
    }            
    
    return ((Math.pow(2 * fraction - 2, 2) * ((c2 + 1) * (fraction * 2 - 2) + c2) + 2) / 2);
});

export function BackInOutAnimationEaseCompact(){
    AddAnimationEase(BackInOutAnimationEase);
}
