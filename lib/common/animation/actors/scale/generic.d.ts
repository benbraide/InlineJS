export declare type ScaleAnimatorActorAxisType = 'x' | 'y' | 'both';
export declare type ScaleAnimatorActorOriginType = 'start' | 'center' | 'end';
export interface IScaleAnimatorActorOrigin {
    x: ScaleAnimatorActorOriginType;
    y: ScaleAnimatorActorOriginType;
}
export interface IScaleAnimationCallbackInfo {
    axis: ScaleAnimatorActorAxisType;
    origin: IScaleAnimatorActorOrigin;
    factor?: number;
}
export interface IScaleAnimatorActorInfo extends IScaleAnimationCallbackInfo {
    name: string;
}
export declare function CreateScaleAnimationCallback({ axis, origin, factor }: IScaleAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
export declare function CreateScaleAnimationActor({ name, ...rest }: IScaleAnimatorActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
