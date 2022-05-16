"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutationObserver = void 0;
const element_scope_id_1 = require("../../component/element-scope-id");
const infer_1 = require("../../component/infer");
const try_1 = require("../../journal/try");
const unique_markers_1 = require("../../utilities/unique-markers");
class MutationObserver {
    constructor() {
        this.uniqueMarkers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
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
                        let key = ((entry.target instanceof HTMLElement) ? (0, element_scope_id_1.GetElementScopeId)(((_a = (0, infer_1.InferComponent)(entry.target)) === null || _a === void 0 ? void 0 : _a.GetRoot()) || null) : '');
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
                        let key = ((info.target instanceof HTMLElement) ? (0, element_scope_id_1.GetElementScopeId)(info.target) : '');
                        if (!key || !(key in mutations)) {
                            return;
                        }
                        let getList = (type, info, list) => {
                            return ((!info.whitelist || info.whitelist.includes(type)) ? list : undefined);
                        };
                        let added = getList('add', info, mutations[key].added), removed = getList('remove', info, mutations[key].removed);
                        let attributes = getList('attribute', info, mutations[key].attributes);
                        if (added || removed || attributes) {
                            (0, try_1.JournalTry)(() => info.handler({ id, added, removed, attributes }), 'InlineJS.MutationObserver');
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
        let id = (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_);
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
exports.MutationObserver = MutationObserver;
