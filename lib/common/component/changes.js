"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Changes = void 0;
const try_1 = require("../journal/try");
const stack_1 = require("../stack");
const deep_copy_1 = require("../utilities/deep-copy");
const changes_monitor_1 = require("./changes-monitor");
const find_1 = require("./find");
class Changes extends changes_monitor_1.ChangesMonitor {
    constructor(componentId_) {
        super();
        this.componentId_ = componentId_;
        this.nextTickHandlers_ = new Array(); // Gets notified at the end of a schedule run
        this.nextIdleHandlers_ = new Array(); // Gets notified when a scheduke runs without any changes
        this.nextNonIdleHandlers_ = new Array(); // Gets notified when a schedule runs with changes
        this.isScheduled_ = false;
        this.isIdle_ = true;
        this.isDestroyed_ = false;
        this.list_ = new Array();
        this.subscribers_ = {};
        this.subscriberPaths_ = {};
        this.origins_ = new stack_1.Stack();
        this.recentRemovals_ = null;
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
        if (this.isDestroyed_ || this.isScheduled_) {
            return;
        }
        this.isScheduled_ = true;
        queueMicrotask(() => {
            this.isScheduled_ = false;
            const batches = new Map();
            const addBatch = (change, callback) => {
                var _a;
                if ((_a = this.recentRemovals_) === null || _a === void 0 ? void 0 : _a.includes(callback))
                    return;
                const batch = batches.get(callback) || [];
                batch.push(change);
                batches.set(callback, batch);
            };
            const getOrigin = (change) => (('original' in change) ? change.original.origin : change.origin);
            if (this.list_.length != 0) {
                const pendingChanges = this.list_.splice(0);
                pendingChanges.forEach((change) => {
                    const origin = getOrigin(change);
                    Object.keys(this.subscribers_).forEach((path) => {
                        if (path === change.path || path.startsWith(`${change.path}.`)) {
                            Object.values(this.subscribers_[path]).filter(callback => (callback !== origin)).forEach(callback => addBatch(change, callback));
                        }
                    });
                });
                this.NotifyListeners_('list', this.list_);
            }
            const after = () => {
                if (this.nextTickHandlers_.length != 0) {
                    this.nextTickHandlers_.splice(0).forEach(handler => (0, try_1.JournalTry)(handler, `InlineJs.Region<${this.componentId_}>.NextTick`));
                    this.NotifyListeners_('next-tick-handlers', this.nextTickHandlers_);
                }
                this.recentRemovals_ = null;
            };
            if (batches.size == 0) { // Idle
                this.isIdle_ = true;
                if (this.nextIdleHandlers_.length != 0) { //Always check for idle handlers if there are no batches
                    this.nextIdleHandlers_.splice(0).forEach(handler => (0, try_1.JournalTry)(handler, `InlineJs.Region<${this.componentId_}>.NextIdle`));
                    this.NotifyListeners_('next-idle-handlers', this.nextIdleHandlers_);
                }
                after();
                return;
            }
            this.isIdle_ = false;
            batches.forEach((changes, callback) => {
                var _a;
                !((_a = this.recentRemovals_) === null || _a === void 0 ? void 0 : _a.includes(callback)) && (0, try_1.JournalTry)(() => callback(changes), `InlineJs.Region<${this.componentId_}>.Schedule`);
            });
            if (this.nextNonIdleHandlers_.length != 0) { //Always check for non-idle handlers if there are batches
                this.nextNonIdleHandlers_.splice(0).forEach(handler => (0, try_1.JournalTry)(handler, `InlineJs.Region<${this.componentId_}>.NextNonIdle`));
                this.NotifyListeners_('next-non-idle-handlers', this.nextNonIdleHandlers_);
            }
            after();
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
        return (0, deep_copy_1.DeepCopy)(this.list_.at(-(index + 1)) || null);
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
        const id = (_a = (0, find_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('sub_');
        if (id) { //Add new subscription
            (this.subscribers_[path] = (this.subscribers_[path] || {}))[id] = handler;
            this.subscriberPaths_[id] = path;
            this.NotifyListeners_('subscribers', this.subscribers_);
        }
        return (id || '');
    }
    Unsubscribe(subscribed, path) {
        this.recentRemovals_ = this.recentRemovals_ || [];
        if (typeof subscribed !== 'string') {
            const paths = (path ? [path] : Object.keys(this.subscribers_));
            paths.forEach(p => {
                if (p in this.subscribers_) {
                    Object.entries(this.subscribers_[p])
                        .filter(([id, entry]) => (subscribed === entry))
                        .map(([id]) => id)
                        .forEach(id => this.Unsubscribe_(id));
                }
            });
        }
        else if (subscribed in this.subscriberPaths_) {
            this.Unsubscribe_(subscribed);
        }
        this.NotifyListeners_('subscribers', this.subscribers_);
    }
    Destroy() {
        if (this.isDestroyed_)
            return;
        this.isDestroyed_ = true;
        this.componentId_ = '';
        this.nextTickHandlers_.splice(0);
        this.nextIdleHandlers_.splice(0);
        this.nextNonIdleHandlers_.splice(0);
        this.isScheduled_ = false;
        this.isIdle_ = true;
        this.list_.splice(0);
        this.subscribers_ = {};
        this.subscriberPaths_ = {};
        this.origins_.Purge();
    }
    Unsubscribe_(id) {
        var _a;
        const path = this.subscriberPaths_[id];
        if (path && path in this.subscribers_ && id in this.subscribers_[path]) {
            (_a = this.recentRemovals_) === null || _a === void 0 ? void 0 : _a.push(this.subscribers_[path][id]);
            delete this.subscribers_[path][id];
            delete this.subscriberPaths_[id];
            if (Object.keys(this.subscribers_[path]).length == 0) {
                delete this.subscribers_[path];
            }
        }
    }
}
exports.Changes = Changes;
