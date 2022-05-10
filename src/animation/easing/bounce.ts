import { IAnimationEaseCallbackDetails } from "../../types/animation";
import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const BounceAnimationEase = CreateAnimationEaseCallback('bounce', ({ fraction }) => {
    if (fraction < (1 / 2.75)){
        return (7.5625 * fraction * fraction);
    }

    if (fraction < (2 / 2.75)){
        fraction -= (1.5 / 2.75);
        return ((7.5625 * fraction * fraction) + 0.75);
    }

    if (fraction < (2.5 / 2.75)){
        fraction -= (2.25 / 2.75);
        return ((7.5625 * fraction * fraction) + 0.9375);
    }
    
    fraction -= (2.625 / 2.75);
    return ((7.5625 * fraction * fraction) + 0.984375);
});

export function BounceAnimationEaseCompact(){
    AddAnimationEase(BounceAnimationEase);
}

export const BounceInAnimationEase = CreateAnimationEaseCallback('bounce.in', ({ fraction, ...rest }) => (1 - BounceAnimationEase.callback({ fraction: (1 - fraction), ...rest })));

export function BounceInAnimationEaseCompact(){
    AddAnimationEase(BounceInAnimationEase);
}

export const BounceOutAnimationEase: IAnimationEaseCallbackDetails = { name: `${BounceAnimationEase.name}.out`, callback: BounceAnimationEase.callback };

export function BounceOutAnimationEaseCompact(){
    AddAnimationEase(BounceOutAnimationEase);
}

export const BounceInOutAnimationEase = CreateAnimationEaseCallback('bounce', ({ fraction, ...rest }) => {
    if (fraction < 0.5){
        return ((1 - BounceInAnimationEase.callback({ fraction: (1 - (2 * fraction)), ...rest },)) / 2);
    }
    
    return ((1 + BounceAnimationEase.callback({ fraction: ((2 * fraction) - 1), ...rest })) / 2);
});

export function BounceInOutAnimationEaseCompact(){
    AddAnimationEase(BounceInOutAnimationEase);
}
