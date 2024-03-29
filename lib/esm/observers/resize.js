import { JournalTry } from "../journal/try";
export class ResizeObserver {
    constructor() {
        this.observer_ = null;
        this.handlers_ = new Array();
        if (globalThis.MutationObserver) {
            try {
                this.observer_ = new globalThis.ResizeObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        this.handlers_.filter(({ target }) => (target === entry.target)).forEach((info) => {
                            JournalTry(() => info.handler({ entry, observer }), 'InlineJS.ResizeObserver');
                        });
                    });
                });
            }
            catch (_a) {
                this.observer_ = null;
            }
        }
    }
    GetNative() {
        return this.observer_;
    }
    Observe(target, handler, options) {
        var _a;
        this.handlers_.push({ target, handler });
        (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.observe(target, (options || { box: 'border-box' }));
    }
    Unobserve(target) {
        var _a;
        this.handlers_ = this.handlers_.filter(info => (info.target === target));
        (_a = this.observer_) === null || _a === void 0 ? void 0 : _a.unobserve(target);
    }
}
