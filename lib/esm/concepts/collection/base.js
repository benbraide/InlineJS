import { WaitPromise } from "../../evaluator/wait-promise";
import { JournalTry } from "../../journal/try";
import { JournalWarn } from "../../journal/warn";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
const DefaultCollectionOptions = {
    indexName: 'id',
    indexNamePlural: 'ids',
    entryName: 'entry',
};
export class CollectionConcept {
    constructor(name_, component_, options) {
        var _a;
        this.name_ = name_;
        this.component_ = component_;
        this.options_ = DefaultCollectionOptions;
        this.queuedTasks_ = null;
        this.items_ = new Array();
        this.itemProxies_ = new Array();
        this.keyedItems_ = {};
        this.id_ = (((_a = this.component_) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId(`${name_}_proxy_`)) || '');
        if (options) {
            Object.entries(options).forEach(([key, value]) => (this.options_[key] = value));
        }
        this.keyedProxy_ = CreateInplaceProxy(BuildGetterProxyOptions({
            getter: (prop) => {
                if (prop) {
                    return this.GetKeyedItem(prop);
                }
            },
        }));
    }
    GetName() {
        return this.name_;
    }
    SetOptions(options) {
        this.options_ = options;
    }
    SetOption(key, value) {
        this.options_[key] = value;
    }
    GetOptions() {
        return this.options_;
    }
    GetOption(key) {
        return (this.options_.hasOwnProperty(key) ? this.options_[key] : undefined);
    }
    GetKeyedProxy() {
        return this.keyedProxy_;
    }
    GetItems() {
        var _a;
        (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.items`);
        return this.GetItems_();
    }
    GetItemProxies() {
        var _a;
        (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.items`);
        return this.itemProxies_;
    }
    GetCount() {
        var _a;
        (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.items.length`);
        return this.items_.reduce((prev, item) => (prev + item.quantity), 0);
    }
    GetKeyedItem(index) {
        var _a;
        (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.items.${index}`);
        if (index in this.keyedItems_) {
            return this.keyedItems_[index];
        }
        let entryName = (this.options_.entryName || DefaultCollectionOptions.entryName);
        this.keyedItems_[index] = this.CreateItemProxy_(entryName, index, () => this.FindItem_(index));
        return this.keyedItems_[index];
    }
    FindItem(index) {
        let found = this.FindItem_(index);
        return (found ? this.MapToExternalItem_(index, found) : null);
    }
    Import({ list, incremental, alertType }) {
        if (this.queuedTasks_) {
            return this.queuedTasks_.push(() => this.Import({ list, incremental, alertType }));
        }
        this.EnterQueueMode_();
        WaitPromise(list, (list) => {
            this.LeaveQueueMode_();
            let updated = new Array();
            list.forEach((info) => {
                this.UpdateItem({ incremental,
                    index: this.ExtractIndex_(info.entry),
                    entry: info.entry,
                    quantity: info.quantity,
                    alertType: 'none',
                    callback: item => updated.push(item),
                });
            });
            if (alertType !== 'none' && alertType !== 'item') {
                window.dispatchEvent(new CustomEvent(`${this.name_}.import`, {
                    detail: { list: updated.map(item => this.MapToExternalItem_(this.ExtractIndex_(item.entry), item)) },
                }));
                this.AlertUpdate_();
            }
        });
    }
    Export() {
        return this.items_.map(item => (Object.assign({}, item)));
    }
    UpdateItem({ index, quantity, entry, incremental, alertType, callback }) {
        var _a;
        if (this.queuedTasks_) {
            return this.queuedTasks_.push(() => this.UpdateItem({ index, quantity, entry, incremental, alertType }));
        }
        let item = this.FindItem_(index);
        if (!item) { //Initialize item
            if (!entry) { //Invalid item
                return JournalWarn('Cannot update an invalid item.', 'InlineJS.CollectionConcept.UpdateItem');
            }
            item = this.InitItem_(entry);
        }
        let count = item.quantity;
        item.quantity = (incremental ? (item.quantity + quantity) : quantity);
        if (item.quantity <= 0) { //Remove item
            let foundIndex = this.FindItemIndex_(index);
            this.items_.splice(foundIndex, 1);
            this.itemProxies_.splice(foundIndex, 1);
        }
        if (item.quantity == count) { //No changes
            return;
        }
        AddChanges('set', `${this.id_}.items.${index}.quantity`, 'quantity', (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        if (callback) {
            callback(item);
        }
        if (alertType !== 'none') { //Alert item update
            window.dispatchEvent(new CustomEvent(`${this.name_}.item`, {
                detail: { item: this.MapToExternalItem_(index, item) },
            }));
        }
        if (alertType !== 'none' && alertType !== 'item') { //Alert update to list
            this.AlertUpdate_();
        }
    }
    AddItem(entry, quantity) {
        this.UpdateItem({ entry, quantity,
            index: this.ExtractIndex_(entry),
        });
    }
    RemoveItem(index) {
        this.UpdateItem({ index,
            quantity: 0,
            incremental: false,
        });
    }
    RemoveAll() {
        if (this.queuedTasks_) {
            return this.queuedTasks_.push(() => this.RemoveAll());
        }
        this.items_.slice(0).forEach(item => this.UpdateItem({ index: this.ExtractIndex_(item), quantity: 0, incremental: false, alertType: 'none' }));
        window.dispatchEvent(new CustomEvent(`${this.name_}.clear`));
        this.AlertUpdate_();
    }
    EnterQueueMode_() {
        if (!this.queuedTasks_) {
            this.queuedTasks_ = new Array();
        }
    }
    LeaveQueueMode_() {
        if (this.queuedTasks_) {
            this.queuedTasks_.forEach(task => JournalTry(task, 'InlineJS.CollectionConcept.QueuedTask'));
            this.queuedTasks_ = null;
        }
    }
    GetItems_() {
        return this.items_.map(item => this.MapToExternalItem_(this.ExtractIndex_(item.entry), item));
    }
    FindItemIndex_(index) {
        let indexName = (this.options_.indexName || DefaultCollectionOptions.indexName);
        return this.items_.findIndex(item => (item.entry.hasOwnProperty(indexName) && item.entry[indexName] === index));
    }
    FindItem_(index) {
        let foundIndex = this.FindItemIndex_(index);
        return ((foundIndex == -1) ? null : this.items_[foundIndex]);
    }
    InitItem_(entry) {
        let entryName = (this.options_.entryName || DefaultCollectionOptions.entryName), index = this.ExtractIndex_(entry), item = { entry,
            quantity: 0,
        };
        this.items_.push(item);
        this.itemProxies_.push(this.CreateItemProxy_(entryName, index, () => item));
        return item;
    }
    CreateItemProxy_(entryName, index, getItem) {
        return CreateInplaceProxy(BuildProxyOptions({
            getter: (prop) => {
                var _a, _b, _c;
                if (prop === 'quantity') {
                    (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${this.id_}.items.${index}.${prop}`);
                    return (((_b = getItem()) === null || _b === void 0 ? void 0 : _b.quantity) || 0);
                }
                if (prop === entryName) {
                    return (((_c = getItem()) === null || _c === void 0 ? void 0 : _c.entry) || {});
                }
            },
            setter: (prop, value) => {
                if (prop === 'quantity') { //Update item quantity
                    let item = getItem();
                    if (item) {
                        this.UpdateItem({ index,
                            quantity: value,
                        });
                    }
                }
                return true;
            },
            lookup: ['quantity', entryName],
        }));
    }
    MapToExternalItem_(index, item) {
        return {
            quantity: item.quantity,
            [this.options_.entryName || DefaultCollectionOptions.entryName]: item.entry,
        };
    }
    ExtractIndex_(item) {
        let indexName = (this.options_.indexName || DefaultCollectionOptions.indexName);
        let entry = item[this.options_.entryName || DefaultCollectionOptions.entryName];
        return (item.hasOwnProperty(indexName) ? item[indexName] : entry[indexName]);
    }
    AlertUpdate_() {
        var _a;
        AddChanges('set', `${this.id_}.items.length`, 'length', (_a = this.component_) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        window.dispatchEvent(new CustomEvent(`${this.name_}.update`));
    }
}
