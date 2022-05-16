import { AnimationActorCallbackType, IAnimationActor } from "../../../types/animation";
export declare type SceneAnimatorActorOriginType = 'start' | 'center' | 'end';
export interface ISceneAnimatorActorOrigin {
    x?: SceneAnimatorActorOriginType;
    y?: SceneAnimatorActorOriginType;
}
export interface ISceneAnimationFrame {
    actor: AnimationActorCallbackType | IAnimationActor;
    checkpoint: number | Array<number>;
}
export interface ISceneAnimationFrameFlat {
    actor: AnimationActorCallbackType | IAnimationActor;
    checkpoint: number;
}
export interface ISceneAnimationFrameRange {
    from: number;
    to: number | null;
}
export interface ISceneAnimationFrameOptimized {
    actor: AnimationActorCallbackType | IAnimationActor;
    range: ISceneAnimationFrameRange;
}
export interface ISceneAnimationCallbackInfo {
    frames: Array<ISceneAnimationFrame>;
    origin?: ISceneAnimatorActorOrigin;
}
export interface ISceneAnimationActorInfo extends ISceneAnimationCallbackInfo {
    name: string;
}
export declare function CreateSceneAnimationCallback({ frames, origin: { x, y } }: ISceneAnimationCallbackInfo): ({ fraction, target, stage }: {
    fraction: any;
    target: any;
    stage: any;
}) => void;
export declare function CreateSceneAnimationActor({ name, ...rest }: ISceneAnimationActorInfo): import("../../../types/animation").IAnimationActorCallbackDetails;
export declare function ApplyRange(fraction: number, from: number, to: number): number;
export declare function ApplyTransform(target: HTMLElement, name: string, value: string): void;
export declare function FormatValue(value: string, count?: number): string;
export declare function ApplyRangeAndTransform(target: HTMLElement, name: string, fraction: number, from: number, to: number, unit?: string, count?: number): void;
