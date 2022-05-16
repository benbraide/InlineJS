import { GetGlobal } from "../../global/get";
import { JournalTry } from "../../journal/try";
import { AddChanges } from "../../proxy/add-changes";
import { DeepCopy } from "../../utilities/deep-copy";
import { IsEqual } from "../../utilities/is-equal";
import { CollectionConcept } from "./base";
export class CartCollectionConcept extends CollectionConcept {
    constructor(component, options) {
        super('cart', component, options);
        this.offsets_ = {};
        this.offsetHandlers_ = {};
        this.offsetHandlers_['subTotal'] = ({ subTotal }) => subTotal;
        this.offsets_['subTotal'] = 0;
    }
    AddOffset(key, handler, initValue = GetGlobal().CreateNothing()) {
        this.offsetHandlers_[key] = handler;
        if (!GetGlobal().IsNothing(initValue)) {
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
            return GetGlobal().CreateNothing();
        }
        let value = this.offsets_[key];
        return (GetGlobal().IsFuture(value) ? value.Get() : value);
    }
    AlertUpdate_() {
        var _a;
        let subTotal = this.items_.reduce((prev, item) => (prev + ((item.entry.price || 0) * item.quantity)), 0), items = this.GetItems_();
        Object.entries(this.offsetHandlers_).forEach(([key, handler]) => JournalTry(() => {
            var _a;
            let value = handler({ subTotal, items });
            if (!IsEqual(this.offsets_[key], value)) {
                this.offsets_[key] = DeepCopy(value);
                AddChanges('set', `${this.id_}.offsets.${key}`, key, (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            }
        }, 'InlineJS.CartCollectionConcept.AfterUpdate'));
        if (!this.offsets_.hasOwnProperty('total')) {
            AddChanges('set', `${this.id_}.offsets.total`, 'total', (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
        super.AlertUpdate_();
    }
}
