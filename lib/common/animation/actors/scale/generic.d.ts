export declare type ScaleAnimatorActorAxisType = 'x' | 'y' | 'both';
export declare type ScaleAnimatorActorOriginType = 'start' | 'center' | 'end';
export interface IScaleAnimatorActorOrigin {
    x: ScaleAnimatorActorOriginType;
    y: ScaleAnimatorActorOriginType;
}
export interface IScaleAnimatorActorInfo {
    name: string;
    axis: ScaleAnimatorActorAxisType;
    origin: IScaleAnimatorActorOrigin;
    factor?: number;
}
export declare function CreateScaleAnimationActor({ name, axis, origin, factor }: IScaleAnimatorActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
