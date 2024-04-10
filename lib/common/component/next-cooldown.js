"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextCooldown = void 0;
const find_1 = require("./find");
const set_proxy_access_handler_1 = require("./set-proxy-access-handler");
class NextCooldown {
    constructor(componentId_, callback_, initialized_ = false) {
        this.componentId_ = componentId_;
        this.callback_ = callback_;
        this.initialized_ = initialized_;
        this.queued_ = false;
        this.setCallback_ = null;
    }
    Queue(callback) {
        var _a;
        const evaluate = () => { var _a; return ((_a = (this.setCallback_ || callback || this.callback_)) === null || _a === void 0 ? void 0 : _a()); }, storedProxyHandler = (0, set_proxy_access_handler_1.StoreProxyHandler)(this.componentId_);
        if (!this.queued_ && this.initialized_) {
            this.queued_ = true;
            this.ListenNext_((_a = (0, find_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes, () => storedProxyHandler(() => {
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
exports.NextCooldown = NextCooldown;
