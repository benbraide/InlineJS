import { AddAnimationActor } from "../add";
import { ApplyRangeAndTransform, CreateSceneAnimationActor } from "./generic";
export const VibrateAnimationActor = CreateSceneAnimationActor({
    name: 'vibrate',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, 0, 0, 'deg') },
        { checkpoint: 1, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, 0, 4, 'deg') },
        { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, -4, 4, 'deg') },
        { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, 4, -4, 'deg') },
        { checkpoint: 90, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, -4, 0, 'deg') },
        { checkpoint: 100, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotateZ', fraction, 0, 0, 'deg') },
    ],
});
export function VibrateAnimationActorCompact() {
    AddAnimationActor(VibrateAnimationActor);
}
