import { AddAnimationActor } from "../add";
import { ApplyRangeAndTransform, CreateSceneAnimationActor } from "./generic";

export const ShakeAnimationActor = CreateSceneAnimationActor({
    name: 'shake',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, 0, 'px') },
        { checkpoint: 1, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, 10, 'px') },
        { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, -10, 10, 'px') },
        { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 10, -10, 'px') },
        { checkpoint: 90, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, -10, 0, 'px') },
        { checkpoint: 100, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, 0, 'px') },
    ],
});

export function ShakeAnimationActorCompact(){
    AddAnimationActor(ShakeAnimationActor);
}
