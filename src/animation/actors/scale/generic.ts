import { CreateAnimationActorCallback } from "../callback";

export type ScaleAnimatorActorAxisType = 'x' | 'y' | 'both';
export type ScaleAnimatorActorOriginType = 'start' | 'center' | 'end';

export interface IScaleAnimatorActorOrigin{
    x: ScaleAnimatorActorOriginType;
    y: ScaleAnimatorActorOriginType;
}

export interface IScaleAnimatorActorInfo{
    name: string;
    axis: ScaleAnimatorActorAxisType;
    origin: IScaleAnimatorActorOrigin;
    factor?: number;
}

export function CreateScaleAnimationActor({ name, axis, origin, factor }: IScaleAnimatorActorInfo){
    let translateOrigin = (value: ScaleAnimatorActorOriginType) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin(origin.x)} ${translateOrigin(origin.y)}`, validFactor = ((factor && factor > 0) ? factor : 1);

    return CreateAnimationActorCallback(name, ({ fraction, target, stage }) => {
        if (stage === 'start'){
            target.style.transformOrigin = translatedOrigin;
        }

        fraction = ((validFactor != 1) ? ((validFactor < 1) ? (1 - (validFactor * (1 - fraction))) : (((validFactor - 1) - ((validFactor - 1) * fraction)) + 1)) : fraction);
        let value = ((axis !== 'x') ? ((axis === 'y') ? `scaleY(${fraction})` : `scale(${fraction}, ${fraction})`) : `scaleX(${fraction})`);

        target.style.transform = target.style.transform.replace(/[ ]*scale[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    });
}
