"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectionObserver = void 0;
const try_1 = require("../../journal/try");
const options_1 = require("./options");
class IntersectionObserver {
    constructor(id_, options) {
        this.id_ = id_;
        this.observer_ = null;
        this.handlers_ = new Array();
        let id = this.id_;
        this.observer_ = new globalThis.IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                this.handlers_.filter(({ target }) => (target === entry.target)).forEach((info) => {
                    (0, try_1.JournalTry)(() => info.handler({ entry, id, observer }), 'InlineJS.IntersectionObserver');
                });
            });
        }, (0, options_1.BuildIntersectionOptions)(options));
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
}
exports.IntersectionObserver = IntersectionObserver;
