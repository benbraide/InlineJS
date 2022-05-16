import { IAnimationActorCollection, IAnimationConcept, IAnimationCreatorCollection, IAnimationEaseCollection } from "../types/animation";
export declare class AnimationConcept implements IAnimationConcept {
    private easeCollection_;
    private actorCollection_;
    private creatorCollection_;
    GetEaseCollection(): IAnimationEaseCollection;
    GetActorCollection(): IAnimationActorCollection;
    GetCreatorCollection(): IAnimationCreatorCollection;
}
