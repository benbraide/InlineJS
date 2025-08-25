"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = void 0;
const try_1 = require("../journal/try");
const root_1 = require("../proxy/root");
class Scope {
    constructor(componentId_, id_, root_) {
        this.componentId_ = componentId_;
        this.id_ = id_;
        this.root_ = root_;
        this.name_ = '';
        this.proxy_ = new root_1.RootProxy(this.componentId_, {}, this.id_);
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
    GetProxy() {
        return this.proxy_;
    }
    FindElement(deepestElement, predicate) {
        if (deepestElement === this.root_ || !this.root_.contains(deepestElement)) {
            return null;
        }
        for (let current = deepestElement.parentElement; current; current = current.parentElement) {
            try {
                if (predicate(current)) {
                    return current;
                }
            }
            catch (_a) {
                // Ignore errors in predicate and continue traversing
            }
            if (current === this.root_) {
                break; // We've processed the root, so we're done
            }
        }
        return null;
    }
    FindAncestor(target, index) {
        let realIndex = (index || 0);
        return this.FindElement(target, () => (realIndex-- == 0));
    }
    Destroy() {
        this.componentId_ = '';
        this.id_ = '';
        this.name_ = '';
        this.root_ = document.createElement('div');
        (0, try_1.JournalTry)(() => this.proxy_.Destroy());
    }
}
exports.Scope = Scope;
