import { AddAnimationActor } from "./add";
import { CreateAnimationActorCallback } from "./callback";
export const OpacityAnimationActor = CreateAnimationActorCallback('opacity', ({ fraction, target, stage }) => {
    if (stage === 'end') {
        target.style.removeProperty('opacity');
    }
    else {
        target.style.opacity = fraction.toString();
    }
});
export function OpacityAnimationActorCompact() {
    AddAnimationActor(OpacityAnimationActor);
}
