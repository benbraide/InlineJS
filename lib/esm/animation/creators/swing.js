import { ApplyRangeAndTransform, CreateSceneAnimationCallback } from "../actors/scene/generic";
export function SwingAnimationCreator({ displacement = 5, unit = 'deg', origin: { x = 'start', y = 'start' } = {} } = {}) {
    return CreateSceneAnimationCallback({
        origin: { x, y },
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, 0, 0, unit) },
            { checkpoint: 1, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, (displacement * 0), (displacement * 3), unit) },
            { checkpoint: 20, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, (displacement * 3), (displacement * -2), unit) },
            { checkpoint: 40, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, (displacement * -2), (displacement * 1), unit) },
            { checkpoint: 60, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, (displacement * 1), (displacement * -1), unit) },
            { checkpoint: 80, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, (displacement * -1), (displacement * 0), unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'rotate', fraction, 0, 0, unit) },
        ],
    });
}
