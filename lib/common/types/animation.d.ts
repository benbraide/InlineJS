export interface IAnimationEaseParams {
    elapsed: number;
    duration: number;
    fraction: number;
}
export declare type AnimationEaseCallbackType = (params: IAnimationEaseParams) => number;
export interface IAnimationEaseCallbackDetails {
    name: string;
    callback: AnimationEaseCallbackType;
}
export declare type FunctionAnimationEaseType = () => IAnimationEaseCallbackDetails;
export interface IAnimationEase {
    GetName(): string;
    Handle: AnimationEaseCallbackType;
}
export interface IAnimationEaseCollection {
    Add(handler: IAnimationEase | AnimationEaseCallbackType, name?: string): void;
    Remove(name: string): void;
    Find(name: string): AnimationEaseCallbackType | null;
}
export interface IAnimationActorParams {
    fraction: number;
    target: HTMLElement;
    stage: 'start' | 'middle' | 'end';
}
export declare type AnimationActorCallbackType = (params: IAnimationActorParams) => void;
export interface IAnimationActorCallbackDetails {
    name: string;
    callback: AnimationActorCallbackType;
}
export declare type FunctionAnimationActorType = () => IAnimationActorCallbackDetails;
export interface IAnimationActor {
    GetName(): string;
    Handle: AnimationActorCallbackType;
}
export interface IAnimationActorCollection {
    Add(handler: IAnimationActor | AnimationActorCallbackType, name?: string): void;
    Remove(name: string): void;
    Find(name: string): AnimationActorCallbackType | null;
}
