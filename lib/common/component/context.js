"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const stack_1 = require("../stack");
class Context {
    constructor() {
        this.record_ = {};
    }
    Push(key, value) {
        (this.record_[key] = (this.record_[key] || new stack_1.Stack())).Push(value);
    }
    Pop(key, noResult) {
        return (this.record_.hasOwnProperty(key) ? this.record_[key].Pop() : (noResult || null));
    }
    Peek(key, noResult) {
        return (this.record_.hasOwnProperty(key) ? this.record_[key].Peek() : (noResult || null));
    }
    Get(key) {
        return (this.record_.hasOwnProperty(key) ? this.record_[key] : null);
    }
    GetHistory(key) {
        return (this.record_.hasOwnProperty(key) ? this.record_[key].GetHistory() : []);
    }
    GetRecordKeys() {
        return Object.keys(this.record_);
    }
}
exports.Context = Context;
