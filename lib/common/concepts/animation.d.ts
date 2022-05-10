import { IAnimationActorCollection, IAnimationConcept, IAnimationEaseCollection } from "../types/animation";
export declare class AnimationConcept implements IAnimationConcept {
    private easeCollection_;
    private actorCollection_;
    GetEaseCollection(): IAnimationEaseCollection;
    GetActorCollection(): IAnimationActorCollection;
}
