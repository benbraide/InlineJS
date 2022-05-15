import { CreateAnimationActorCallback } from "../callback";

export type ScaleAnimatorActorAxisType = 'x' | 'y' | 'both';
export type ScaleAnimatorActorOriginType = 'start' | 'center' | 'end';

export interface IScaleAnimatorActorOrigin{
    x: ScaleAnimatorActorOriginType;
    y: ScaleAnimatorActorOriginType;
}

export interface IScaleAnimationCallbackInfo{
    axis?: ScaleAnimatorActorAxisType;
    origin?: IScaleAnimatorActorOrigin;
    factor?: number;
}

export interface IScaleAnimatorActorInfo extends IScaleAnimationCallbackInfo{
    name: string;
}

export function CreateScaleAnimationCallback({ axis, origin, factor }: IScaleAnimationCallbackInfo = {}){
    let translateOrigin = (value: ScaleAnimatorActorOriginType) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin(origin?.x || 'center')} ${translateOrigin(origin?.y || 'center')}`, validFactor = ((factor && factor > 0) ? factor : 1);

    return ({ fraction, target, stage }) => {
        if (stage === 'start'){
            target.style.transformOrigin = translatedOrigin;
        }

        fraction = ((validFactor != 1) ? ((validFactor < 1) ? (1 - (validFactor * (1 - fraction))) : (((validFactor - 1) - ((validFactor - 1) * fraction)) + 1)) : fraction);
        let value = ((axis !== 'x') ? ((axis === 'y') ? `scaleY(${fraction})` : `scale(${fraction}, ${fraction})`) : `scaleX(${fraction})`);

        target.style.transform = target.style.transform.replace(/[ ]*scale[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    };
}

export function CreateScaleAnimationActor({ name, ...rest }: IScaleAnimatorActorInfo){
    return CreateAnimationActorCallback(name, CreateScaleAnimationCallback(rest));
}
