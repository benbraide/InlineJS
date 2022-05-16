"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationConcept = void 0;
const actor_1 = require("../animation/collection/actor");
const creator_1 = require("../animation/collection/creator");
const ease_1 = require("../animation/collection/ease");
class AnimationConcept {
    constructor() {
        this.easeCollection_ = new ease_1.AnimationEaseCollection();
        this.actorCollection_ = new actor_1.AnimationActorCollection();
        this.creatorCollection_ = new creator_1.AnimationCreatorCollection();
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
exports.AnimationConcept = AnimationConcept;
