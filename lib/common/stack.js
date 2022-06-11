"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
class Stack {
    constructor(duplicate) {
        this.list_ = new Array();
        if (duplicate) {
            this.list_ = duplicate.list_.map(item => item);
        }
    }
    Push(value) {
        this.list_.push(value);
    }
    Pop() {
        return ((this.list_.length == 0) ? null : this.list_.pop());
    }
    Peek() {
        return ((this.list_.length == 0) ? null : this.list_[this.list_.length - 1]);
    }
    IsEmpty() {
        return (this.list_.length == 0);
    }
    GetHistory() {
        return this.list_.map(item => item);
    }
}
exports.Stack = Stack;
