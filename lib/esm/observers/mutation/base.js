import { GetElementScopeId } from "../../component/element-scope-id";
import { InferComponent } from "../../component/infer";
import { JournalTry } from "../../journal/try";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../../utilities/unique-markers";
export class MutationObserver {
    constructor() {
        this.uniqueMarkers_ = GetDefaultUniqueMarkers();
        this.observer_ = null;
        this.handlers_ = {};
        if (globalThis.MutationObserver) {
            try {
                this.observer_ = new globalThis.MutationObserver((entries) => {
                    let mutations = {}, getInfo = (key) => {
                        return (mutations[key] = mutations[key] || {
                            added: new Array(),
                            removed: new Array(),
                            attributes: new Array(),
                        });
                    };
                    entries.forEach((entry) => {
                        var _a;
                        let key = ((entry.target instanceof HTMLElement) ? GetElementScopeId(((_a = InferComponent(entry.target)) === null || _a === void 0 ? void 0 : _a.GetRoot()) || null) : '');
                        if (!key) { //Invalid target
                            return;
                        }
                        if ((entry === null || entry === void 0 ? void 0 : entry.type) === 'childList') {
                            let info = getInfo(key);
                            info.added.push(...Array.from(entry.addedNodes));
                            info.removed.push(...Array.from(entry.removedNodes));
                        }
                        else if ((entry === null || entry === void 0 ? void 0 : entry.type) === 'attributes' && entry.attributeName) {
                            getInfo(key).attributes.push({
                                name: entry.attributeName,
                                target: entry.target,
                            });
                        }
                    });
                    if (Object.keys(mutations).length == 0) {
                        return;
                    }
                    Object.entries(this.handlers_).forEach(([id, info]) => {
                        let key = ((info.target instanceof HTMLElement) ? GetElementScopeId(info.target) : '');
                        if (!key || !(key in mutations)) {
                            return;
                        }
                        let getList = (type, info, list) => {
                            return ((!info.whitelist || info.whitelist.includes(type)) ? list : undefined);
                        };
                        let added = getList('add', info, mutations[key].added), removed = getList('remove', info, mutations[key].removed);
                        let attributes = getList('attribute', info, mutations[key].attributes);
                        if (added || removed || attributes) {
                            JournalTry(() => info.handler({ id, added, removed, attributes }), 'InlineJS.MutationObserver');
                        }
                    });
                });
                this.observer_.observe(document, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: false,
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
    Observe(target, handler, whitelist) {
        let id = GenerateUniqueId(this.uniqueMarkers_);
        this.handlers_[id] = { target, handler, whitelist };
        return id;
    }
    Unobserve(target) {
        if (typeof target !== 'string') {
            Object.entries(this.handlers_).filter(([key, info]) => (info.target === target)).forEach(([key]) => (delete this.handlers_[key]));
        }
        else { //Remove by ID
            delete this.handlers_[target];
        }
    }
}
