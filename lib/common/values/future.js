"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Future = void 0;
class Future {
    constructor(callback_) {
        this.callback_ = callback_;
    }
    Get() {
        return this.callback_();
    }
}
exports.Future = Future;
