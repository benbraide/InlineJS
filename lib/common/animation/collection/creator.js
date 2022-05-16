"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationCreatorCollection = void 0;
class AnimationCreatorCollection {
    constructor() {
        this.list_ = {};
    }
    Add(name, creator) {
        this.list_[name] = creator;
    }
    Remove(name) {
        delete this.list_[name];
    }
    Find(name) {
        return (this.list_.hasOwnProperty(name) ? this.list_[name] : null);
    }
}
exports.AnimationCreatorCollection = AnimationCreatorCollection;
