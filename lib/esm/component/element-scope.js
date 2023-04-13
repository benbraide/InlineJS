import { DirectiveManager } from "../directive/manager";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { PeekCurrentScope } from "./current-scope";
import { ElementScopeKey } from "./element-scope-id";
import { UnbindOutsideEvent } from "./event";
import { FindComponentById } from "./find";
export class ElementScope {
    constructor(componentId_, id_, element_, isRoot_) {
        this.componentId_ = componentId_;
        this.id_ = id_;
        this.element_ = element_;
        this.isRoot_ = isRoot_;
        this.isInitialized_ = false;
        this.scopeId_ = '';
        this.key_ = '';
        this.changesMonitorList_ = new Array();
        this.locals_ = {};
        this.data_ = {};
        this.managers_ = {
            directive: null,
        };
        this.callbacks_ = {
            post: new Array(),
            postAttributes: new Array(),
            uninit: new Array(),
            treeChange: new Array(),
            attributeChange: new Array(),
        };
        this.state_ = {
            isMarked: false,
            isDestroyed: false,
        };
        this.scopeId_ = (PeekCurrentScope(this.componentId_) || '');
    }
    SetInitialized() {
        this.isInitialized_ = true;
    }
    IsInitialized() {
        return this.isInitialized_;
    }
    GetComponentId() {
        return this.componentId_;
    }
    GetScopeId() {
        return this.scopeId_;
    }
    GetId() {
        return this.id_;
    }
    AddChangesMonitor(monitor) {
        this.changesMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        })));
    }
    RemoveChangesMonitor(monitor) {
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        })));
    }
    SetKey(key) {
        this.key_ = key;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'key',
            object: () => key,
        })));
    }
    GetKey() {
        return this.key_;
    }
    GetElement() {
        return this.element_;
    }
    IsRoot() {
        return this.isRoot_;
    }
    SetLocal(key, value) {
        if (!this.state_.isMarked) {
            this.locals_[key] = value;
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'locals',
                object: () => { return Object.assign({}, this.locals_); },
            })));
        }
    }
    DeleteLocal(key) {
        delete this.locals_[key];
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'locals',
            object: () => { return Object.assign({}, this.locals_); },
        })));
    }
    HasLocal(key) {
        return (key in this.locals_);
    }
    GetLocal(key) {
        return ((key in this.locals_) ? this.locals_[key] : GetGlobal().CreateNothing());
    }
    GetLocals() {
        return this.locals_;
    }
    SetData(key, value) {
        if (!this.state_.isMarked) {
            this.data_[key] = value;
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'data',
                object: () => { return Object.assign({}, this.data_); },
            })));
        }
    }
    GetData(key) {
        return ((key in this.data_) ? this.data_[key] : GetGlobal().CreateNothing());
    }
    AddPostProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.post.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'post-process-callbacks',
                object: () => { return [...this.callbacks_.post]; },
            })));
        }
    }
    ExecutePostProcessCallbacks() {
        (this.callbacks_.post || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }
    AddPostAttributesProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.postAttributes.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'post-attributes-process-callbacks',
                object: () => { return [...this.callbacks_.postAttributes]; },
            })));
        }
    }
    ExecutePostAttributesProcessCallbacks() {
        (this.callbacks_.postAttributes || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostAttributesProcessCallbacks'));
    }
    AddUninitCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.uninit.push(callback);
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'uninit-callbacks',
                object: () => { return [...this.callbacks_.uninit]; },
            })));
        }
    }
    RemoveUninitCallback(callback) {
        this.callbacks_.uninit = this.callbacks_.uninit.filter(c => (c !== callback));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'uninit-callbacks',
            object: () => { return [...this.callbacks_.uninit]; },
        })));
    }
    AddTreeChangeCallback(callback) {
        this.callbacks_.treeChange.push(callback);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'tree-change-callbacks',
            object: () => { return [...this.callbacks_.treeChange]; },
        })));
    }
    RemoveTreeChangeCallback(callback) {
        this.callbacks_.treeChange = this.callbacks_.treeChange.filter(c => (c !== callback));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'tree-change-callbacks',
            object: () => { return [...this.callbacks_.treeChange]; },
        })));
    }
    ExecuteTreeChangeCallbacks(added, removed) {
        this.callbacks_.treeChange.forEach(callback => JournalTry(() => callback({ added, removed })));
    }
    AddAttributeChangeCallback(callback, whitelist) {
        if (this.state_.isMarked) {
            return;
        }
        let existing = this.callbacks_.attributeChange.find(info => (info.callback === callback));
        if (!existing) {
            this.callbacks_.attributeChange.push({
                callback: callback,
                whitelist: ((typeof whitelist === 'string') ? [whitelist] : (whitelist || [])),
            });
        }
        else { //Add whitelist to existing
            existing.whitelist.push(...(whitelist || []));
        }
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-callbacks',
            object: () => { return [...this.callbacks_.attributeChange]; },
        })));
    }
    RemoveAttributeChangeCallback(callback, whitelist) {
        let index = this.callbacks_.attributeChange.findIndex(info => (info.callback === callback));
        if (index == -1) {
            return;
        }
        let computedWhitelist = ((typeof whitelist === 'string') ? [whitelist] : (whitelist || []));
        if (computedWhitelist.length != 0 && this.callbacks_.attributeChange[index].whitelist.length != 0) {
            computedWhitelist.forEach((item) => {
                this.callbacks_.attributeChange[index].whitelist = this.callbacks_.attributeChange[index].whitelist.filter(eItem => (eItem !== item));
            });
        }
        else { //Clear whitelist
            this.callbacks_.attributeChange[index].whitelist.splice(0);
        }
        if (this.callbacks_.attributeChange[index].whitelist.length == 0) {
            this.callbacks_.attributeChange.splice(index, 1);
        }
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-callbacks',
            object: () => { return [...this.callbacks_.attributeChange]; },
        })));
    }
    ExecuteAttributeChangeCallbacks(name) {
        (this.callbacks_.attributeChange || []).filter(info => ((info.whitelist || []).length == 0 || info.whitelist.includes(name)))
            .forEach(info => JournalTry(() => info.callback(name)));
    }
    Destroy(markOnly) {
        if (this.state_.isDestroyed) {
            return;
        }
        this.state_.isMarked = true;
        if (!(this.element_ instanceof HTMLTemplateElement)) {
            let component = FindComponentById(this.componentId_);
            if (component) {
                this.DestroyChildren_(component, this.element_, (markOnly || false));
            }
        }
        if (markOnly) {
            return;
        }
        this.callbacks_.uninit.splice(0).forEach((callback) => {
            try {
                callback();
            }
            catch (_a) { }
        });
        this.callbacks_.post.splice(0);
        this.callbacks_.treeChange.splice(0);
        this.callbacks_.attributeChange.splice(0);
        this.data_ = {};
        this.locals_ = {};
        this.state_.isDestroyed = true;
        UnbindOutsideEvent(this.element_);
        GetGlobal().GetMutationObserver().Unobserve(this.element_);
        let component = FindComponentById(this.componentId_);
        component === null || component === void 0 ? void 0 : component.RemoveElementScope(this.id_); //Remove from component
        delete this.element_[ElementScopeKey]; //Remove id value on element
        if (this.isRoot_) { //Remove component -- wait for changes to finalize
            let componentId = this.componentId_;
            component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddNextTickHandler(() => GetGlobal().RemoveComponent(componentId));
        }
    }
    IsMarked() {
        return this.state_.isMarked;
    }
    IsDestroyed() {
        return this.state_.isDestroyed;
    }
    GetDirectiveManager() {
        return (this.managers_.directive = (this.managers_.directive || new DirectiveManager()));
    }
    DestroyChildren_(component, target, markOnly) {
        Array.from(target.children).filter(child => !child.contains(target)).forEach((child) => {
            let childScope = component.FindElementScope(child);
            if (childScope) { //Destroy element scope
                childScope.Destroy(markOnly);
            }
            else { //No element scope -- destroy children
                this.DestroyChildren_(component, child, markOnly);
            }
        });
    }
}
