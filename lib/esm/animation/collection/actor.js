export class AnimationActorCollection {
    constructor() {
        this.handlers_ = {};
    }
    Add(handler, name) {
        if (typeof handler !== 'function') {
            this.handlers_[handler.GetName()] = handler;
        }
        else if (name) {
            this.handlers_[name] = handler;
        }
    }
    Remove(name) {
        delete this.handlers_[name];
    }
    Find(name) {
        if (this.handlers_.hasOwnProperty(name)) {
            let handler = this.handlers_[name];
            return ((typeof handler === 'function') ? handler : (params) => handler.Handle(params));
        }
        return null;
    }
}
