export class Scope {
    constructor(componentId_, id_, root_) {
        this.componentId_ = componentId_;
        this.id_ = id_;
        this.root_ = root_;
        this.name_ = '';
    }
    GetComponentId() {
        return this.componentId_;
    }
    GetId() {
        return this.id_;
    }
    SetName(name) {
        this.name_ = name;
    }
    GetName() {
        return this.name_;
    }
    GetRoot() {
        return this.root_;
    }
    FindElement(deepestElement, predicate) {
        if (deepestElement === this.root_ || !this.root_.contains(deepestElement)) {
            return null;
        }
        do {
            deepestElement = deepestElement.parentElement;
            try {
                if (predicate(deepestElement)) {
                    return deepestElement;
                }
            }
            catch (_a) { }
        } while (deepestElement !== this.root_);
        return null;
    }
    FindAncestor(target, index) {
        let realIndex = (index || 0);
        return this.FindElement(target, () => (realIndex-- == 0));
    }
}
