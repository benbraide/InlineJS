export class Future {
    constructor(callback_) {
        this.callback_ = callback_;
    }
    Get() {
        return this.callback_();
    }
}
