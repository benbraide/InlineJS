import { AnimationActorCollection } from "../animation/collection/actor";
import { AnimationEaseCollection } from "../animation/collection/ease";
import { IAnimationActorCollection, IAnimationConcept, IAnimationEaseCollection } from "../types/animation";

export class AnimationConcept implements IAnimationConcept{
    private easeCollection_ = new AnimationEaseCollection();
    private actorCollection_ = new AnimationActorCollection();
    
    public GetEaseCollection(): IAnimationEaseCollection{
        return this.easeCollection_;
    }

    public GetActorCollection(): IAnimationActorCollection{
        return this.actorCollection_;
    }
}
