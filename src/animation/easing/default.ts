import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const DefaultAnimationEase = CreateAnimationEaseCallback('default', ({ fraction }) => ((fraction != 1) ? (-1 * Math.cos(fraction * (Math.PI / 2)) + 1) : 1));

export function DefaultAnimationEaseCompact(){
    AddAnimationEase(DefaultAnimationEase);
}
