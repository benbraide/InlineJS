import { JournalTry } from "../journal/try";
import { BuildIntersectionOptions } from "./intersection-options";
export class IntersectionObserver {
    constructor(id_, options) {
        this.id_ = id_;
        this.observer_ = null;
        this.handlers_ = new Array();
        const id = this.id_;
        this.observer_ = new globalThis.IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                this.handlers_.filter(({ target }) => (target === entry.target)).forEach((info) => {
                    JournalTry(() => info.handler({ entry, id, observer }), 'InlineJS.IntersectionObserver');
                });
            });
        }, BuildIntersectionOptions(options));
    }
    GetId() {
        return this.id_;
    }
    GetNative() {
        return this.observer_;
    }
    Observe(target, handler) {
        var _a;
        this.handlers_.push({ target, handler });
        (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.observe(target);
    }
    Unobserve(target) {
        var _a;
        this.handlers_ = this.handlers_.filter(info => (info.target === target));
        (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.unobserve(target);
    }
    Destroy() {
        var _a;
        this.handlers_.forEach(({ target }) => { var _a; return (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.unobserve(target); });
        this.handlers_ = [];
        (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.observer_ = null;
    }
}
