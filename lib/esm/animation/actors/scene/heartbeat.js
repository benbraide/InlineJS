import { AddAnimationActor } from "../add";
import { ApplyRangeAndTransform, CreateSceneAnimationActor } from "./generic";
export const HeartbeatAnimationActor = CreateSceneAnimationActor({
    name: 'heartbeat',
    frames: [
        { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1, '', 2) },
        { checkpoint: [1, 28], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1.26, '', 2) },
        { checkpoint: [14, 42], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1.26, 1, '', 2) },
        { checkpoint: 70, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'scale', fraction, 1, 1, '', 2) },
    ],
});
export function HeartbeatAnimationActorCompact() {
    AddAnimationActor(HeartbeatAnimationActor);
}
