import { CreateAnimationActorCallback } from "../callback";

export type TranslateAnimatorActorAxisType = 'x' | 'y' | 'both';

export interface ITranslateAnimatorActorInfo{
    name: string;
    axis: TranslateAnimatorActorAxisType;
    factor?: number;
}

export const DefaultTranslateAnimatorActorFactor = 9999;

export function CreateTranslateAnimationActor({ name, axis, factor }: ITranslateAnimatorActorInfo){
    let validFactor = (factor ? factor : DefaultTranslateAnimatorActorFactor);

    return CreateAnimationActorCallback(name, ({ fraction, target }) => {
        let delta = ((validFactor < 0) ? (validFactor + (-validFactor * fraction)) : (validFactor - (validFactor * fraction)));
        let value = ((axis !== 'x') ? ((axis === 'y') ? `translateY(${delta})` : `translate(${delta}, ${delta})`) : `translateX(${delta})`);

        target.style.transform = target.style.transform.replace(/[ ]*translate[XY]?\(.+?\)/g, '');
        target.style.transform += ` ${value}`;
    });
}
