"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const stack_1 = require("./stack");
class Context {
    constructor() {
        this.stacks_ = {};
    }
    Push(key, value) {
        (this.stacks_[key] = (this.stacks_[key] || new stack_1.Stack())).Push(value);
    }
    Pop(key, noResult = null) {
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Pop() : noResult);
    }
    Peek(key, noResult = null) {
        return ((key in this.stacks_ && this.stacks_[key].IsEmpty()) ? this.stacks_[key].Peek() : noResult);
    }
    Get(key) {
        return ((key in this.stacks_) ? new stack_1.Stack(this.stacks_[key]) : null);
    }
}
exports.Context = Context;
