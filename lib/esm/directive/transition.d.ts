import { IAnimationEaseParams, IAnimationTransition, AnimationStageType } from "../types/animation";
export interface IAnimationPassParams extends IAnimationEaseParams {
    target: HTMLElement;
    stage: AnimationStageType;
}
export interface ITransitionParams {
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    callback: (waited: boolean) => any;
    onAbort?: () => void;
    onPass?: (params: IAnimationPassParams) => void;
    reverse?: boolean;
    allowRepeats?: boolean;
    restore?: boolean;
}
export interface IAnimationParams {
    componentId: string;
    contextElement: HTMLElement;
    target?: HTMLElement;
    keyframes: Array<Keyframe>;
    duration?: number;
    initialDelay?: number;
    delay?: number;
    repeats?: number;
    callback: (waited: boolean) => any;
    onAbort?: () => void;
}
export declare const DefaultTransitionDuration = 300;
export declare const DefaultTransitionDelay = 0;
export declare const DefaultTransitionInitialDelay = 0;
export declare const DefaultTransitionRepeats = 0;
export declare function ResolveTransition(info: IAnimationTransition | null, reverse: boolean): IAnimationTransition | null;
export declare function WaitAnimation({ componentId, contextElement, target, keyframes, duration, initialDelay, delay, repeats, callback, onAbort }: IAnimationParams): (() => void) | null;
export declare function WaitTransition({ componentId, contextElement, target, callback, onAbort, onPass, reverse, allowRepeats, restore }: ITransitionParams): (() => void) | null;
