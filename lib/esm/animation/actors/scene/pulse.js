import { AddAnimationActor } from "../add";
import { ApplyRangeAndTransform, CreateSceneAnimationActor } from "./generic";
export const PulseAnimationActor = CreateSceneAnimationActor({
    name: 'pulse',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1, '', 2) },
        { checkpoint: 1, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1.26, '', 2) },
        { checkpoint: 50, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1.26, 1, '', 2) },
        { checkpoint: 100, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1, '', 2) },
    ],
});
export function PulseAnimationActorCompact() {
    AddAnimationActor(PulseAnimationActor);
}
