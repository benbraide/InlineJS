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
export declare type AnimationCreatorCallbackType = (...args: any[]) => AnimationActorCallbackType;
export interface IAnimationCreatorCollection {
    Add(name: string, creator: AnimationCreatorCallbackType): void;
    Remove(name: string): void;
    Find(name: string): AnimationCreatorCallbackType | null;
}
export interface IAnimationConcept {
    GetEaseCollection(): IAnimationEaseCollection;
    GetActorCollection(): IAnimationActorCollection;
    GetCreatorCollection(): IAnimationCreatorCollection;
}
export interface IAnimationTransition {
    ease: IAnimationEase | AnimationEaseCallbackType | null;
    actor: IAnimationActor | AnimationActorCallbackType | null;
    duration: number;
    allowed?: 'normal' | 'reversed' | 'both';
}
