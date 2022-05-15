export declare type RotateAnimationActorAxisType = 'x' | 'y' | 'z' | 'all';
export declare type RotateAnimatorActorOriginType = 'start' | 'center' | 'end';
export interface IRotateAnimatorActorOrigin {
    x: RotateAnimatorActorOriginType;
    y: RotateAnimatorActorOriginType;
}
export interface IRotateAnimationCallbackInfo {
    axis?: RotateAnimationActorAxisType;
    origin?: IRotateAnimatorActorOrigin;
    factor?: number;
    unit?: string;
}
export interface IRotateAnimationActorInfo extends IRotateAnimationCallbackInfo {
    name: string;
}
export declare const DefaultRotateAnimationActorFactor = 360;
export declare const DefaultRotateAnimationActorUnit = "deg";
export declare function CreateRotateAnimationCallback({ axis, origin, factor, unit }?: IRotateAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
export declare function CreateRotateAnimationActor({ name, ...rest }: IRotateAnimationActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
