import { CreateAnimationActorCallback } from "../callback";

export type TranslateAnimationActorAxisType = 'x' | 'y' | 'both';

export interface ITranslateAnimationCallbackInfo{
    axis?: TranslateAnimationActorAxisType;
    factor?: number;
    unit?: string;
}

export interface ITranslateAnimationActorInfo extends ITranslateAnimationCallbackInfo{
    name: string;
}

export const DefaultTranslateAnimationActorFactor = 9999;
export const DefaultTranslateAnimationActorUnit = 'px';

export function CreateTranslateAnimationCallback({ axis, factor, unit }: ITranslateAnimationCallbackInfo = {}){
    let validFactor = (factor ? factor : DefaultTranslateAnimationActorFactor);
    let validUnit = (unit ? unit : DefaultTranslateAnimationActorUnit);

    return ({ fraction, target }) => {
        let delta = ((validFactor < 0) ? (validFactor + (-validFactor * fraction)) : (validFactor - (validFactor * fraction)));
        let value = ((axis !== 'x') ? ((axis === 'y') ? `translateY(${delta}${validUnit})` : `translate(${delta}${validUnit}, ${delta}${validUnit})`) : `translateX(${delta}${validUnit})`);

        target.style.transform = target.style.transform.replace(/[ ]*translate[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    };
}

export function CreateTranslateAnimationActor({ name, ...rest }: ITranslateAnimationActorInfo){
    return CreateAnimationActorCallback(name, CreateTranslateAnimationCallback(rest));
}
