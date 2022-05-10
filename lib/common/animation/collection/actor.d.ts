import { AnimationActorCallbackType, IAnimationActor, IAnimationActorCollection } from "../../types/animation";
export declare class AnimationActorCollection implements IAnimationActorCollection {
    private handlers_;
    Add(handler: IAnimationActor | AnimationActorCallbackType, name?: string): void;
    Remove(name: string): void;
    Find(name: string): AnimationActorCallbackType | null;
}
