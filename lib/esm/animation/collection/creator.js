export class AnimationCreatorCollection {
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
