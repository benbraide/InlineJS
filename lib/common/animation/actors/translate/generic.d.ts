export declare type TranslateAnimatorActorAxisType = 'x' | 'y' | 'both';
export interface ITranslateAnimatorActorInfo {
    name: string;
    axis: TranslateAnimatorActorAxisType;
    factor?: number;
}
export declare const DefaultTranslateAnimatorActorFactor = 9999;
export declare function CreateTranslateAnimationActor({ name, axis, factor }: ITranslateAnimatorActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
