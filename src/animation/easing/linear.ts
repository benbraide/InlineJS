import { AddAnimationEase } from "./add";
import { CreateAnimationEaseCallback } from "./callback";

export const LinearAnimationEase = CreateAnimationEaseCallback('linear', ({ fraction }) => fraction);

export function LinearAnimationEaseCompact(){
    AddAnimationEase(LinearAnimationEase);
}
