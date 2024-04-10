import { FindComponentById } from "./find";
import { StoreProxyHandler } from "./set-proxy-access-handler";
export class NextCooldown {
    constructor(componentId_, callback_, initialized_ = false) {
        this.componentId_ = componentId_;
        this.callback_ = callback_;
        this.initialized_ = initialized_;
        this.queued_ = false;
        this.setCallback_ = null;
    }
    Queue(callback) {
        var _a;
        const evaluate = () => { var _a; return ((_a = (this.setCallback_ || callback || this.callback_)) === null || _a === void 0 ? void 0 : _a()); }, storedProxyHandler = StoreProxyHandler(this.componentId_);
        if (!this.queued_ && this.initialized_) {
            this.queued_ = true;
            this.ListenNext_((_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes, () => storedProxyHandler(() => {
                this.queued_ = false;
                evaluate();
            }));
        }
        else if (!this.initialized_) { //Initialize
            this.initialized_ = true;
            evaluate();
        }
        else {
            this.setCallback_ = (callback || null);
        }
    }
    ListenNext_(changes, callback) { }
}
