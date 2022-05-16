"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changes = void 0;
const error_1 = require("../journal/error");
const stack_1 = require("../stack");
const deep_copy_1 = require("../utilities/deep-copy");
const current_1 = require("./current");
const find_1 = require("./find");
class Changes {
    constructor(componentId_) {
        this.componentId_ = componentId_;
        this.nextTickHandlers_ = new Array();
        this.isScheduled_ = false;
        this.list_ = new Array();
        this.subscribers_ = {};
        this.lastAccessContext_ = '';
        this.getAccessStorages_ = new stack_1.Stack();
        this.origins_ = new stack_1.Stack();
    }
    GetComponentId() {
        return this.componentId_;
    }
    AddNextTickHandler(handler) {
        this.nextTickHandlers_.push(handler);
    }
    Schedule() {
        if (this.isScheduled_) {
            return;
        }
        this.isScheduled_ = true;
        queueMicrotask(() => {
            this.isScheduled_ = false;
            let batches = new Array(), addBatch = (change, callback) => {
                let batch = batches.find(info => (info.callback === callback));
                if (!batch) {
                    batches.push({
                        callback: callback,
                        changes: new Array(change),
                    });
                }
                else { //Add to existing batch
                    batch.changes.push(change);
                }
            };
            let getOrigin = (change) => (('original' in change) ? change.original.origin : change.origin);
            this.list_.splice(0).forEach((change) => {
                Object.values(this.subscribers_).filter(sub => (sub.path === change.path && sub.callback !== getOrigin(change))).forEach(sub => addBatch(change, sub.callback));
            });
            batches.forEach(batch => batch.callback(batch.changes));
            this.nextTickHandlers_.splice(0).forEach((handler) => {
                try {
                    handler();
                }
                catch (err) {
                    (0, error_1.JournalError)(err, `InlineJs.Region<${this.componentId_}>.NextTick`);
                }
            });
        });
    }
    Add(change) {
        this.list_.push(change);
        this.Schedule();
    }
    AddComposed(prop, prefix, targetPath) {
        let change = {
            componentId: this.componentId_,
            type: 'set',
            path: (prefix ? `${prefix}.${prop}` : prop),
            prop: prop,
            origin: this.origins_.Peek(),
        };
        if (targetPath) { //Bubbled change
            this.Add({
                original: change,
                path: targetPath,
            });
        }
        else {
            this.Add(change);
        }
    }
    GetLastChange(index = 0) {
        return (0, deep_copy_1.DeepCopy)(this.list_.at(-(index + 1)) || null);
    }
    AddGetAccess(path) {
        var _a, _b, _c, _d;
        let targetObject = (((_a = (0, find_1.FindComponentById)((0, current_1.PeekCurrentComponent)() || '')) === null || _a === void 0 ? void 0 : _a.GetBackend().changes) || this);
        let lastPointIndex = path.lastIndexOf('.');
        this.lastAccessContext_ = ((lastPointIndex == -1) ? '' : path.substring(0, lastPointIndex));
        let storage = targetObject.getAccessStorages_.Peek();
        if (!(storage === null || storage === void 0 ? void 0 : storage.details)) {
            return;
        }
        (_b = storage.details.raw) === null || _b === void 0 ? void 0 : _b.entries.push({
            compnentId: this.componentId_,
            path: path,
        });
        if (storage.details.optimized && storage.details.optimized.entries !== ((_c = storage.details.raw) === null || _c === void 0 ? void 0 : _c.entries) && //Optimized is not linked to raw
            storage.details.optimized.entries.length != 0 && //Optimized list is not empty
            storage.lastAccessPath && storage.lastAccessPath.length < path.length && //Last access path is possibly a substring of path
            path.indexOf(`${storage.lastAccessPath}.`) == 0 //Last access path is confirmed as a substring of path
        ) {
            storage.details.optimized.entries.at(-1).path = path; //Replace last optimized entry
        }
        else if (storage.details.optimized && storage.details.optimized.entries !== ((_d = storage.details.raw) === null || _d === void 0 ? void 0 : _d.entries)) { //Add a new optimized entry
            storage.details.optimized.entries.push({
                compnentId: this.componentId_,
                path: path,
            });
        }
        storage.lastAccessPath = path; //Update last access path
    }
    GetLastAccessContext() {
        return this.lastAccessContext_;
    }
    ResetLastAccessContext() {
        this.lastAccessContext_ = '';
    }
    PushGetAccessStorage(storage) {
        var _a;
        this.getAccessStorages_.Push({
            details: (storage || {
                optimized: ((((_a = (0, find_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetReactiveState()) === 'optimized') ? {
                    entries: new Array(),
                    snapshots: new stack_1.Stack(),
                } : undefined),
                raw: {
                    entries: new Array(),
                    snapshots: new stack_1.Stack(),
                },
            }),
            lastAccessPath: '',
        });
    }
    PopGetAccessStorage() {
        var _a;
        return (((_a = this.getAccessStorages_.Pop()) === null || _a === void 0 ? void 0 : _a.details) || null);
    }
    SwapOptimizedGetAccessStorage() {
        let storage = this.getAccessStorages_.Peek();
        if ((storage === null || storage === void 0 ? void 0 : storage.details.optimized) && storage.details.raw) {
            storage.details.optimized.entries = storage.details.raw.entries;
        }
    }
    RestoreOptimizedGetAccessStorage() {
        var _a;
        let storage = this.getAccessStorages_.Peek();
        if ((storage === null || storage === void 0 ? void 0 : storage.details.optimized) && storage.details.optimized.entries === ((_a = storage.details.raw) === null || _a === void 0 ? void 0 : _a.entries)) {
            storage.details.optimized.entries = storage.details.raw.entries.slice(0);
        }
    }
    FlushRawGetAccessStorage() {
        var _a, _b;
        (_b = (_a = this.getAccessStorages_.Peek()) === null || _a === void 0 ? void 0 : _a.details.raw) === null || _b === void 0 ? void 0 : _b.entries.splice(0);
    }
    PushGetAccessStorageSnapshot() {
        var _a, _b;
        let storage = this.getAccessStorages_.Peek();
        (_a = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _a === void 0 ? void 0 : _a.snapshots.Push(storage.details.optimized.entries.slice(0).map(entry => (Object.assign({}, entry))));
        (_b = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _b === void 0 ? void 0 : _b.snapshots.Push(storage.details.raw.entries.slice(0).map(entry => (Object.assign({}, entry))));
    }
    PopGetAccessStorageSnapshot(discard) {
        var _a, _b, _c, _d;
        let storage = this.getAccessStorages_.Peek();
        let optimizedSnapshot = (_a = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _a === void 0 ? void 0 : _a.snapshots.Pop();
        if (!discard && optimizedSnapshot && ((_b = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _b === void 0 ? void 0 : _b.entries)) {
            storage.details.optimized.entries = optimizedSnapshot;
        }
        let rawSnapshot = (_c = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _c === void 0 ? void 0 : _c.snapshots.Pop();
        if (!discard && rawSnapshot && ((_d = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _d === void 0 ? void 0 : _d.entries)) {
            storage.details.raw.entries = rawSnapshot;
        }
    }
    PopAllGetAccessStorageSnapshots(discard) {
        var _a, _b, _c, _d, _e, _f;
        let storage = this.getAccessStorages_.Peek();
        let optimizedSnapshot = (_a = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _a === void 0 ? void 0 : _a.snapshots.Pop();
        while (((_b = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _b === void 0 ? void 0 : _b.snapshots) && !storage.details.optimized.snapshots.IsEmpty()) {
            optimizedSnapshot = storage.details.optimized.snapshots.Pop();
        }
        if (!discard && optimizedSnapshot && ((_c = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _c === void 0 ? void 0 : _c.entries)) {
            storage.details.optimized.entries = optimizedSnapshot;
        }
        let rawSnapshot = (_d = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _d === void 0 ? void 0 : _d.snapshots.Pop();
        while (((_e = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _e === void 0 ? void 0 : _e.snapshots) && !storage.details.raw.snapshots.IsEmpty()) {
            rawSnapshot = storage.details.raw.snapshots.Pop();
        }
        if (!discard && rawSnapshot && ((_f = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _f === void 0 ? void 0 : _f.entries)) {
            storage.details.raw.entries = rawSnapshot;
        }
    }
    PushOrigin(origin) {
        this.origins_.Push(origin);
    }
    PeekOrigin() {
        return this.origins_.Peek();
    }
    PopOrigin() {
        return this.origins_.Pop();
    }
    Subscribe(path, handler) {
        var _a;
        let id = (_a = (0, find_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('sub_');
        if (id) { //Add new subscription
            this.subscribers_[id] = {
                path: path,
                callback: handler,
            };
        }
        return (id || '');
    }
    Unsubscribe(subscribed, path) {
        if (typeof subscribed !== 'string') {
            Object.entries(this.subscribers_).filter(([id, entry]) => (subscribed === entry.callback && (!path || path === entry.path))).map(([id]) => id).forEach(id => {
                this.Unsubscribe_(id);
            });
        }
        else if (subscribed in this.subscribers_) {
            this.Unsubscribe_(subscribed);
        }
    }
    Unsubscribe_(id) {
        delete this.subscribers_[id];
    }
}
exports.Changes = Changes;
