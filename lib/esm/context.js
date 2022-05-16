import { Stack } from "./stack";
export class Context {
    constructor() {
        this.stacks_ = {};
    }
    Push(key, value) {
        (this.stacks_[key] = (this.stacks_[key] || new Stack())).Push(value);
    }
    Pop(key, noResult = null) {
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Pop() : noResult);
    }
    Peek(key, noResult = null) {
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Peek() : noResult);
    }
    Get(key) {
        return ((key in this.stacks_) ? new Stack(this.stacks_[key]) : null);
    }
}
