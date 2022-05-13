import { ApplyRangeAndTransform, CreateSceneAnimationCallback } from "../actors/scene/generic";

export interface IShakeAnimationCallbackInfo{
    displacement?: number;
    unit?: string;
}

export function ShakeAnimationCreator({ displacement = 10, unit = 'px' }: IShakeAnimationCallbackInfo = {}){
    return CreateSceneAnimationCallback({
        frames: [
            { checkpoint: 0, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, 0, unit) },
            { checkpoint: 1, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, displacement, unit) },
            { checkpoint: [10, 30, 50, 70], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, -displacement, displacement, unit) },
            { checkpoint: [20, 40, 60, 80], actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, displacement, -displacement, unit) },
            { checkpoint: 90, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, -displacement, 0, unit) },
            { checkpoint: 100, actor: ({ target, fraction }) => ApplyRangeAndTransform(target, 'translateX', fraction, 0, 0, unit) },
        ],
    });
}
