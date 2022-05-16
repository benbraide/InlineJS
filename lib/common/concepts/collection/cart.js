"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartCollectionConcept = void 0;
const get_1 = require("../../global/get");
const try_1 = require("../../journal/try");
const add_changes_1 = require("../../proxy/add-changes");
const deep_copy_1 = require("../../utilities/deep-copy");
const is_equal_1 = require("../../utilities/is-equal");
const base_1 = require("./base");
class CartCollectionConcept extends base_1.CollectionConcept {
    constructor(component, options) {
        super('cart', component, options);
        this.offsets_ = {};
        this.offsetHandlers_ = {};
        this.offsetHandlers_['subTotal'] = ({ subTotal }) => subTotal;
        this.offsets_['subTotal'] = 0;
    }
    AddOffset(key, handler, initValue = (0, get_1.GetGlobal)().CreateNothing()) {
        this.offsetHandlers_[key] = handler;
        if (!(0, get_1.GetGlobal)().IsNothing(initValue)) {
            this.offsets_[key] = initValue;
        }
    }
    RemoveOffset(key) {
        delete this.offsetHandlers_[key];
    }
    GetOffset(key) {
        var _a;
        (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.offsets.${key}`);
        if (!this.offsets_.hasOwnProperty(key)) {
            if (key === 'total') {
                return (Object.values(this.offsets_).filter(value => (typeof value === 'number')).reduce((prev, value) => (prev + value), 0) || 0);
            }
            return (0, get_1.GetGlobal)().CreateNothing();
        }
        let value = this.offsets_[key];
        return ((0, get_1.GetGlobal)().IsFuture(value) ? value.Get() : value);
    }
    AlertUpdate_() {
        var _a;
        let subTotal = this.items_.reduce((prev, item) => (prev + ((item.entry.price || 0) * item.quantity)), 0), items = this.GetItems_();
        Object.entries(this.offsetHandlers_).forEach(([key, handler]) => (0, try_1.JournalTry)(() => {
            var _a;
            let value = handler({ subTotal, items });
            if (!(0, is_equal_1.IsEqual)(this.offsets_[key], value)) {
                this.offsets_[key] = (0, deep_copy_1.DeepCopy)(value);
                (0, add_changes_1.AddChanges)('set', `${this.id_}.offsets.${key}`, key, (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            }
        }, 'InlineJS.CartCollectionConcept.AfterUpdate'));
        if (!this.offsets_.hasOwnProperty('total')) {
            (0, add_changes_1.AddChanges)('set', `${this.id_}.offsets.total`, 'total', (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
        super.AlertUpdate_();
    }
}
exports.CartCollectionConcept = CartCollectionConcept;
