import { Stack } from "../stack";
export class Context {
    constructor() {
        this.record_ = {};
    }
    Push(key, value) {
        (this.record_[key] = (this.record_[key] || new Stack())).Push(value);
    }
    Pop(key, noResult) {
        return ((key in this.record_) ? this.record_[key].Pop() : (noResult || null));
    }
    Peek(key, noResult) {
        return ((key in this.record_) ? this.record_[key].Peek() : (noResult || null));
    }
    Get(key) {
        return ((key in this.record_) ? this.record_[key] : null);
    }
}
