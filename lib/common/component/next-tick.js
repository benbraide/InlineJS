"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextTick = void 0;
const find_1 = require("./find");
class NextTick {
    constructor(componentId_, callback_, initialized_ = false) {
        this.componentId_ = componentId_;
        this.callback_ = callback_;
        this.initialized_ = initialized_;
        this.queued_ = false;
        this.setCallback_ = null;
    }
    Queue(callback) {
        var _a;
        let evaluate = () => ((this.setCallback_ || callback || this.callback_) && (this.setCallback_ || callback || this.callback_)());
        if (!this.queued_ && this.initialized_) {
            this.queued_ = true;
            (_a = (0, find_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => {
                this.queued_ = false;
                evaluate();
            });
        }
        else if (!this.initialized_) { //Initialize
            this.initialized_ = true;
            evaluate();
        }
        else {
            this.setCallback_ = (callback || null);
        }
    }
}
exports.NextTick = NextTick;
