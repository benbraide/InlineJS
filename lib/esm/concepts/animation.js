import { AnimationActorCollection } from "../animation/collection/actor";
import { AnimationCreatorCollection } from "../animation/collection/creator";
import { AnimationEaseCollection } from "../animation/collection/ease";
export class AnimationConcept {
    constructor() {
        this.easeCollection_ = new AnimationEaseCollection();
        this.actorCollection_ = new AnimationActorCollection();
        this.creatorCollection_ = new AnimationCreatorCollection();
    }
    GetEaseCollection() {
        return this.easeCollection_;
    }
    GetActorCollection() {
        return this.actorCollection_;
    }
    GetCreatorCollection() {
        return this.creatorCollection_;
    }
}
