import { AddAnimationActor } from "./add";
import { CreateAnimationActorCallback } from "./callback";

export const OpacityAnimationActor = CreateAnimationActorCallback('opacity', ({ fraction, target, stage }) => (target.style.opacity = ((stage === 'end') ? 1 : fraction).toString()));

export function OpacityAnimationActorCompact(){
    AddAnimationActor(OpacityAnimationActor);
}
