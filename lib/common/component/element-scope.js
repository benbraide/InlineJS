"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementScope = void 0;
const manager_1 = require("../directives/manager");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const current_scope_1 = require("./current-scope");
const element_scope_id_1 = require("./element-scope-id");
const event_1 = require("./event");
const find_1 = require("./find");
class ElementScope {
    constructor(componentId_, id_, element_, isRoot_) {
        this.componentId_ = componentId_;
        this.id_ = id_;
        this.element_ = element_;
        this.isRoot_ = isRoot_;
        this.scopeId_ = '';
        this.key_ = '';
        this.locals_ = {};
        this.data_ = {};
        this.managers_ = {
            directive: null,
        };
        this.callbacks_ = {
            post: new Array(),
            uninit: new Array(),
            treeChange: new Array(),
            attributeChange: new Array(),
        };
        this.state_ = {
            isMarked: false,
            isDestroyed: false,
        };
        this.scopeId_ = ((0, current_scope_1.PeekCurrentScope)(this.componentId_) || '');
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
    SetKey(key) {
        this.key_ = key;
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
        }
    }
    DeleteLocal(key) {
        delete this.locals_[key];
    }
    HasLocal(key) {
        return (key in this.locals_);
    }
    GetLocal(key) {
        return ((key in this.locals_) ? this.locals_[key] : (0, get_1.GetGlobal)().CreateNothing());
    }
    GetLocals() {
        return this.locals_;
    }
    SetData(key, value) {
        if (!this.state_.isMarked) {
            this.data_[key] = value;
        }
    }
    GetData(key) {
        return ((key in this.data_) ? this.data_[key] : (0, get_1.GetGlobal)().CreateNothing());
    }
    AddPostProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.post.push(callback);
        }
    }
    ExecutePostProcessCallbacks() {
        (this.callbacks_.post || []).forEach(callback => (0, try_1.JournalTry)(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }
    AddUninitCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.uninit.push(callback);
        }
    }
    RemoveUninitCallback(callback) {
        this.callbacks_.uninit = this.callbacks_.uninit.filter(c => (c !== callback));
    }
    AddTreeChangeCallback(callback) {
        this.callbacks_.treeChange.push(callback);
    }
    RemoveTreeChangeCallback(callback) {
        this.callbacks_.treeChange = this.callbacks_.treeChange.filter(c => (c !== callback));
    }
    ExecuteTreeChangeCallbacks(added, removed) {
        this.callbacks_.treeChange.forEach(callback => (0, try_1.JournalTry)(() => callback({ added, removed })));
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
    }
    ExecuteAttributeChangeCallbacks(name) {
        (this.callbacks_.attributeChange || []).filter(info => ((info.whitelist || []).length == 0 || info.whitelist.includes(name)))
            .forEach(info => (0, try_1.JournalTry)(() => info.callback(name)));
    }
    Destroy(markOnly) {
        if (this.state_.isDestroyed) {
            return;
        }
        this.state_.isMarked = true;
        if (!(this.element_ instanceof HTMLTemplateElement) && this.element_.tagName.toLowerCase() !== 'svg') {
            let component = (0, find_1.FindComponentById)(this.componentId_);
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
        (0, event_1.UnbindOutsideEvent)(this.element_);
        (0, get_1.GetGlobal)().GetMutationObserver().Unobserve(this.element_);
        let component = (0, find_1.FindComponentById)(this.componentId_);
        component === null || component === void 0 ? void 0 : component.RemoveElementScope(this.id_); //Remove from component
        delete this.element_[element_scope_id_1.ElementScopeKey]; //Remove id value on element
        if (this.isRoot_) { //Remove component -- wait for changes to finalize
            let componentId = this.componentId_;
            component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddNextTickHandler(() => (0, get_1.GetGlobal)().RemoveComponent(componentId));
        }
    }
    IsMarked() {
        return this.state_.isMarked;
    }
    IsDestroyed() {
        return this.state_.isDestroyed;
    }
    GetDirectiveManager() {
        return (this.managers_.directive = (this.managers_.directive || new manager_1.DirectiveManager()));
    }
    DestroyChildren_(component, target, markOnly) {
        Array.from(target.children).forEach((child) => {
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
exports.ElementScope = ElementScope;