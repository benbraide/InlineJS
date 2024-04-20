import { JournalTry } from "../journal/try";
import { Stack } from "../stack";
import { DeepCopy } from "../utilities/deep-copy";
import { ChangesMonitor } from "./changes-monitor";
import { PeekCurrentComponent } from "./current";
import { FindComponentById } from "./find";
export class Changes extends ChangesMonitor {
    constructor(componentId_) {
        super();
        this.componentId_ = componentId_;
        this.nextTickHandlers_ = new Array();
        this.nextIdleHandlers_ = new Array();
        this.nextNonIdleHandlers_ = new Array();
        this.isScheduled_ = false;
        this.isIdle_ = true;
        this.list_ = new Array();
        this.subscribers_ = {};
        this.lastAccessContext_ = '';
        this.getAccessStorages_ = new Stack();
        this.origins_ = new Stack();
    }
    GetComponentId() {
        return this.componentId_;
    }
    AddNextTickHandler(handler) {
        this.nextTickHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
    }
    AddNextIdleHandler(handler) {
        this.nextIdleHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
    }
    AddNextNonIdleHandler(handler) {
        this.nextNonIdleHandlers_.push(handler);
        this.Schedule();
        this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
    }
    Schedule() {
        if (this.isScheduled_) {
            return;
        }
        this.isScheduled_ = true;
        queueMicrotask(() => {
            this.isScheduled_ = false;
            const batches = new Array(), addBatch = (change, callback) => {
                const batch = batches.find(info => (info.callback === callback));
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
            const getOrigin = (change) => (('original' in change) ? change.original.origin : change.origin);
            if (this.list_.length != 0) {
                this.list_.splice(0).forEach((change) => {
                    Object.values(this.subscribers_).filter(sub => (sub.path === change.path && sub.callback !== getOrigin(change))).forEach(sub => addBatch(change, sub.callback));
                });
                this.NotifyListeners_('list', this.list_);
            }
            if (batches.length == 0) {
                if (!this.isIdle_) {
                    this.isIdle_ = true;
                    if (this.nextIdleHandlers_.length != 0) {
                        this.nextIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextIdle`));
                        this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
                    }
                }
                return;
            }
            if (this.isIdle_) { // Out of idle
                this.isIdle_ = false;
                if (this.nextNonIdleHandlers_.length != 0) {
                    this.nextNonIdleHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextNonIdle`));
                    this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
                }
            }
            batches.forEach(batch => batch.callback(batch.changes));
            if (this.nextTickHandlers_.length != 0) {
                this.nextTickHandlers_.splice(0).forEach(handler => JournalTry(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
                this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
            }
            this.NotifyListeners_('scheduled', this.isScheduled_);
            this.Schedule(); // Defer idle check
        });
        this.NotifyListeners_('scheduled', this.isScheduled_);
    }
    Add(change) {
        this.list_.push(change);
        this.Schedule();
        this.NotifyListeners_('list', this.list_);
    }
    AddComposed(prop, prefix, targetPath) {
        const change = {
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
        return DeepCopy(this.list_.at(-(index + 1)) || null);
    }
    AddGetAccess(path) {
        var _a, _b, _c, _d;
        const targetObject = (((_a = FindComponentById(PeekCurrentComponent() || '')) === null || _a === void 0 ? void 0 : _a.GetBackend().changes) || this);
        const lastPointIndex = path.lastIndexOf('.');
        targetObject.lastAccessContext_ = ((lastPointIndex == -1) ? '' : path.substring(0, lastPointIndex));
        const storage = targetObject.getAccessStorages_.Peek();
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
        this.NotifyListeners_('last-access-context', this.list_);
        targetObject.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    GetLastAccessContext() {
        return this.lastAccessContext_;
    }
    ResetLastAccessContext() {
        this.lastAccessContext_ = '';
        this.NotifyListeners_('last-access-context', this.lastAccessContext_);
    }
    PushGetAccessStorage(storage) {
        var _a;
        this.getAccessStorages_.Push({
            details: (storage || {
                optimized: ((((_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetReactiveState()) === 'optimized') ? {
                    entries: new Array(),
                    snapshots: new Stack(),
                } : undefined),
                raw: {
                    entries: new Array(),
                    snapshots: new Stack(),
                },
            }),
            lastAccessPath: '',
        });
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    PopGetAccessStorage() {
        var _a;
        const details = (((_a = this.getAccessStorages_.Pop()) === null || _a === void 0 ? void 0 : _a.details) || null);
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        return details;
    }
    SwapOptimizedGetAccessStorage() {
        const storage = this.getAccessStorages_.Peek();
        if ((storage === null || storage === void 0 ? void 0 : storage.details.optimized) && storage.details.raw) {
            storage.details.optimized.entries = storage.details.raw.entries;
            this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        }
    }
    RestoreOptimizedGetAccessStorage() {
        var _a;
        const storage = this.getAccessStorages_.Peek();
        if ((storage === null || storage === void 0 ? void 0 : storage.details.optimized) && storage.details.optimized.entries === ((_a = storage.details.raw) === null || _a === void 0 ? void 0 : _a.entries)) {
            storage.details.optimized.entries = storage.details.raw.entries.slice(0);
            this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
        }
    }
    FlushRawGetAccessStorage() {
        var _a, _b;
        (_b = (_a = this.getAccessStorages_.Peek()) === null || _a === void 0 ? void 0 : _a.details.raw) === null || _b === void 0 ? void 0 : _b.entries.splice(0);
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    PushGetAccessStorageSnapshot() {
        var _a, _b;
        const storage = this.getAccessStorages_.Peek();
        (_a = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _a === void 0 ? void 0 : _a.snapshots.Push(storage.details.optimized.entries.slice(0).map(entry => (Object.assign({}, entry))));
        (_b = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _b === void 0 ? void 0 : _b.snapshots.Push(storage.details.raw.entries.slice(0).map(entry => (Object.assign({}, entry))));
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    PopGetAccessStorageSnapshot(discard) {
        var _a, _b, _c, _d;
        const storage = this.getAccessStorages_.Peek();
        const optimizedSnapshot = (_a = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _a === void 0 ? void 0 : _a.snapshots.Pop();
        if (!discard && optimizedSnapshot && ((_b = storage === null || storage === void 0 ? void 0 : storage.details.optimized) === null || _b === void 0 ? void 0 : _b.entries)) {
            storage.details.optimized.entries = optimizedSnapshot;
        }
        const rawSnapshot = (_c = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _c === void 0 ? void 0 : _c.snapshots.Pop();
        if (!discard && rawSnapshot && ((_d = storage === null || storage === void 0 ? void 0 : storage.details.raw) === null || _d === void 0 ? void 0 : _d.entries)) {
            storage.details.raw.entries = rawSnapshot;
        }
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    PopAllGetAccessStorageSnapshots(discard) {
        var _a, _b, _c, _d, _e, _f;
        const storage = this.getAccessStorages_.Peek();
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
        this.NotifyListeners_('get-access-storages', this.getAccessStorages_);
    }
    PushOrigin(origin) {
        this.origins_.Push(origin);
        this.NotifyListeners_('origins', this.origins_);
    }
    PeekOrigin() {
        return this.origins_.Peek();
    }
    PopOrigin() {
        const origin = this.origins_.Pop();
        this.NotifyListeners_('origins', this.origins_);
        return origin;
    }
    Subscribe(path, handler) {
        var _a;
        const id = (_a = FindComponentById(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('sub_');
        if (id) { //Add new subscription
            this.subscribers_[id] = {
                path: path,
                callback: handler,
            };
            this.NotifyListeners_('subscribers', this.subscribers_);
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
        this.NotifyListeners_('subscribers', this.subscribers_);
    }
    Unsubscribe_(id) {
        delete this.subscribers_[id];
    }
}
