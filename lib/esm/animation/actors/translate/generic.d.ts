export declare type TranslateAnimationActorAxisType = 'x' | 'y' | 'both';
export interface ITranslateAnimationCallbackInfo {
    axis?: TranslateAnimationActorAxisType;
    factor?: number;
    unit?: string;
}
export interface ITranslateAnimationActorInfo extends ITranslateAnimationCallbackInfo {
    name: string;
}
export declare const DefaultTranslateAnimationActorFactor = 9999;
export declare const DefaultTranslateAnimationActorUnit = "px";
export declare function CreateTranslateAnimationCallback({ axis, factor, unit }?: ITranslateAnimationCallbackInfo): ({ fraction, target }: {
    fraction: any;
    target: any;
}) => void;
export declare function CreateTranslateAnimationActor({ name, ...rest }: ITranslateAnimationActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
