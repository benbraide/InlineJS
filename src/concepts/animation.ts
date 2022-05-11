import { AnimationActorCollection } from "../animation/collection/actor";
import { AnimationCreatorCollection } from "../animation/collection/creator";
import { AnimationEaseCollection } from "../animation/collection/ease";
import { IAnimationActorCollection, IAnimationConcept, IAnimationCreatorCollection, IAnimationEaseCollection } from "../types/animation";

export class AnimationConcept implements IAnimationConcept{
    private easeCollection_ = new AnimationEaseCollection();
    private actorCollection_ = new AnimationActorCollection();
    private creatorCollection_ = new AnimationCreatorCollection();
    
    public GetEaseCollection(): IAnimationEaseCollection{
        return this.easeCollection_;
    }

    public GetActorCollection(): IAnimationActorCollection{
        return this.actorCollection_;
    }

    public GetCreatorCollection(): IAnimationCreatorCollection{
        return this.creatorCollection_;
    }
}
